using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Collections.Generic;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly HttpClient _httpClient = new HttpClient();
    private const string ApiKey = "AIzaSyDxSMpco3NWfIdMu78AV4oj_3g6tlJNS34";

    [HttpPost]
    public async Task<IActionResult> PostMessage([FromBody] MessageRequest request)
    {
        if (string.IsNullOrEmpty(request.Message))
            return BadRequest(new { error = "Viesti puuttuu" });

        // alkuperäinen contets lista
        var contents = new List<object>
        {
            new
            {
                role = "user",
                parts = new[] { new { text = request.Message } }
            }
        };

        var vastaus = await LahetaGeminille(contents);
        return Ok(new { response = vastaus });
    }

    private async Task<string> LahetaGeminille(List<object> contents)
    {
        var endpoint = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={ApiKey}";

        var runko = new
        {
            contents = contents.ToArray(),
            tools = new[]
            {
                new
                {
                    functionDeclarations = new[]
                    {
                        new
                        {
                            name = "hae_quote",
                            description = "Hakee satunnaisen quoten verkosta",
                            parameters = new
                            {
                                type = "object",
                                properties = new
                                {
                                    category = new { type = "string", description = "Quoten kategoria" }
                                }
                            }
                        }
                    }
                }
            }
        };

        var jsonRunko = JsonSerializer.Serialize(runko);

        int maxRetries = 3;
        int delayMs = 2000;

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            var sisalto = new StringContent(jsonRunko, Encoding.UTF8, "application/json");
            var vastaus = await _httpClient.PostAsync(endpoint, sisalto);
            var vastausString = await vastaus.Content.ReadAsStringAsync();

            if (!vastaus.IsSuccessStatusCode)
            {
                if (vastaus.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable)
                {
                    await Task.Delay(delayMs);
                    continue;
                }
                return $"Virhe API-kutsussa: {vastaus.StatusCode} - {vastausString}";
            }

            try
            {
                using var doc = JsonDocument.Parse(vastausString);
                
                //Geminin viesti tarkistusta varten
                Console.WriteLine("=== Geminin viesti ===");
                Console.WriteLine(vastausString); 
                
                var candidates = doc.RootElement.GetProperty("candidates");
                if (candidates.GetArrayLength() == 0)
                    return "(Vastaus Geminiltä oli tyhjä)";

                var candidate = candidates[0];
                var content = candidate.GetProperty("content");
                var parts = content.GetProperty("parts");

                // jos gemini lähetti function callin
                if (parts[0].TryGetProperty("functionCall", out var functionCall))
                {
                    string functionName = functionCall.GetProperty("name").GetString() ?? "";
                    // suoritetaan functioncall tässä tapauksesssa vain haequote
                    // lisää ehtoja jos lisäät funktioita
                    string quote = await HaeQuote();

                    // uusi content jossa mukana functioncall sekä quote
                    var newContents = new List<object>(contents)
                    {
                        new
                        {
                            role = "model",
                            parts = new[]
                            {
                                new
                                {
                                    functionCall = new
                                    {
                                        name = functionName,
                                        args = JsonDocument.Parse(functionCall.GetProperty("args").GetRawText()).RootElement
                                    }
                                }
                            }
                        },
                        new
                        {
                            role = "function",
                            parts = new[]
                            {
                                new
                                {
                                    functionResponse = new
                                    {
                                        name = functionName,
                                        response = new { result = quote }
                                    }
                                }
                            }
                        }
                    };

                    // uusi contents geminille
                    return await LahetaGeminille(newContents);
                }

                // jos ei functioncallia niin palautetaan normaali teksti
                if (parts[0].TryGetProperty("text", out var textProp))
                {
                    return textProp.GetString() ?? "(Tyhjä vastaus Geminiltä)";
                }

                return "Vastausta ei voitu tulkita";
            }
            catch
            {
                return "Vastausta ei voitu tulkita.";
            }
        }

        return "Palvelin ylikuormittunut useamman yrityksen jälkeen.";
    }

    private async Task<string> HaeQuote()
    {
        var quoteUrl = "https://dummyjson.com/quotes/random";
        var response = await _httpClient.GetAsync(quoteUrl);
        var json = await response.Content.ReadAsStringAsync();

        using var doc = JsonDocument.Parse(json);
        var quote = doc.RootElement.GetProperty("quote").GetString();
        var author = doc.RootElement.GetProperty("author").GetString();

        return $"\"{quote}\" — {author}";
    }
}

public class MessageRequest
{
    public string? Message { get; set; }
}
