using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> PostMessage([FromBody] MessageRequest request)
    {
        // Tarkistaa ettei viesti ole tyhjä
        if (string.IsNullOrEmpty(request.Message))
        {
            return BadRequest(new { error = "Viesti puuttuu" });
        }

        // Lähettää kysymyksen geminille
        var vastaus = await LahetaGeminille(request.Message);

        // Palautetaan vastaus frontendille
        return Ok(new { response = vastaus });
    }

    // Yhteys Geminiin
    private async Task<string> LahetaGeminille(string viesti)
    {
        /*
        // väliaikainen testi
        await Task.Delay(500);
        return $"(Testivastaus Geminiltä) Kysyit: {viesti}";
        */
        using var client = new HttpClient();

        var apiKey = "AIzaSyDxSMpco3NWfIdMu78AV4oj_3g6tlJNS34";
        
        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={apiKey}";

        // Pyynnön sisältö Googlen dokumentaation mukaan
        var runko = new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = viesti }
                    }
                }
            }
        };
        
        var jsonRunko = JsonSerializer.Serialize(runko);
        var sisalto = new StringContent(jsonRunko, Encoding.UTF8, "application/json");

        int maxRetries = 3;       // yritetään enintään 3 kertaa
        int delayMs = 2000;       // odotetaan 2 sekuntia ennen uutta yritystä

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            var vastaus = await client.PostAsync(endpoint, sisalto);
            var vastausString = await vastaus.Content.ReadAsStringAsync();

            if (vastaus.IsSuccessStatusCode)
            {
                try
                {
                    using var doc = JsonDocument.Parse(vastausString);
                    var teksti = doc.RootElement
                        .GetProperty("candidates")[0]
                        .GetProperty("content")
                        .GetProperty("parts")[0]
                        .GetProperty("text")
                        .GetString();
                    
                    return teksti ?? "(Tyhjä vastaus Geminiltä)";
                }
                catch
                {
                    return "Vastausta ei voitu tulkita.";
                }
            }
            else if (vastaus.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
            {
                // Ylikuormitus, odotetaan ja yritetään uudelleen
                await Task.Delay(delayMs);
            }
            else
            {
                // Muu virhe
                return $"Virhe API-kutsussa: {vastaus.StatusCode} - {vastausString}";
            }
        }

        return "Palvelin oli ylikuormittunut useamman yrityksen jälkeen. Kokeile myöhemmin.";
        
    }
}

// Luokka, jota käytetään viestin vastaanottamiseen
public class MessageRequest
{
    public string? Message { get; set; }
}
