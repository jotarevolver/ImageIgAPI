const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3000;

app.get('/get-image', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).send({ error: 'No URL provided' });
    }

    try {
        // Iniciar Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Navegar a la URL proporcionada
        await page.goto(url, { waitUntil: 'networkidle2' });

        // Extraer la URL de la imagen desde el <div> con la clase "_aagv"
        const imgSrc = await page.evaluate(() => {
            const imgDiv = document.querySelector('div._aagv');
            const img = imgDiv ? imgDiv.querySelector('img') : null;
            return img ? img.src : null;
        });

        await browser.close();

        if (imgSrc) {
            return res.send({ src: imgSrc });
        } else {
            return res.status(404).send({ error: 'Image not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch image' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
