
const express = require("express");
const axios = require('axios');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Image route works!');
});

router.post('/generate-image', async (req, res) => {
    console.log('Generating image for prompt:', req.body.prompt);
    // const { prompt } = req.body;
    // console.log('Generating image for prompt:', prompt);
  
    // try {
    //   const response = await axios.post('http://127.0.0.1:7860/sdapi/v1/txt2img', {
    //     prompt: prompt,
    //     steps: 20,
    //   });
  
    //   const imageBase64 = response.data.images[0];
    //     res.json({ image: imageBase64 });
    //     console.log('Image generated successfully');
    // } catch (error) {
    //   console.error('Error generating image:', error);
    //   res.status(500).send('Error generating image');
    // }
});
  
module.exports = router;
  