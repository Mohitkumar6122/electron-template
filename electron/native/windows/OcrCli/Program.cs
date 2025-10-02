using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Windows.Graphics.Imaging;
using Windows.Media.Ocr;
using Windows.Storage.Streams;

namespace OcrCli
{
    class Program
    {
        static async Task<int> Main(string[] args)
        {
            if (args.Length < 1)
            {
                Console.Error.WriteLine("Usage: OcrCli <imagePath> [lang1 lang2 ...]");
                return 2;
            }
            var imagePath = args[0];
            var languages = args.Skip(1).ToArray();
            try
            {
                var bytes = await File.ReadAllBytesAsync(imagePath);
                using var mem = new InMemoryRandomAccessStream();
                using (var writer = new DataWriter(mem))
                {
                    writer.WriteBytes(bytes);
                    await writer.StoreAsync();
                    await writer.FlushAsync();
                    writer.DetachStream();
                }

                var decoder = await BitmapDecoder.CreateAsync(mem);
                var softwareBitmap = await decoder.GetSoftwareBitmapAsync();
                var ocr = OcrEngine.TryCreateFromUserProfileLanguages();
                if (languages.Length > 0)
                {
                    // Windows.Media.Ocr picks from user profile; explicit language selection is limited.
                    // If needed, guide user to install and set preferred languages.
                }
                var result = await ocr.RecognizeAsync(softwareBitmap);
                Console.WriteLine(result.Text);
                return 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
                return 1;
            }
        }
    }
}


