import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:3000/api/products';
const IMAGE_PATH = path.resolve('public/images/about/hvac_main.png');

async function verifyOptimization() {
    console.log('🚀 Starting Image Optimization Verification Test...');

    if (!fs.existsSync(IMAGE_PATH)) {
        console.error('❌ Sample image not found at:', IMAGE_PATH);
        process.exit(1);
    }

    const originalSize = fs.statSync(IMAGE_PATH).size;
    console.log(`📊 Original Image: ${path.basename(IMAGE_PATH)} (${(originalSize / 1024).toFixed(2)} KB)`);

    // Read image and convert to Base64
    const imageBuffer = fs.readFileSync(IMAGE_PATH);
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    const testProduct = {
        name: "Optimization Test Product",
        category: "Test",
        features: "Testing WebP conversion and Supabase upload",
        description: "This product was created to verify image optimization logic.",
        imageUrl: base64Image,
        isVisible: false
    };

    console.log('📡 Sending POST request to API...');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testProduct)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ API Response Received!');
        console.log('📂 Result Data:', JSON.stringify(result, null, 2));

        console.log('\n--- Verification Checklist ---');
        
        // Check 1: Image URL format
        if (result.imageUrl.startsWith('https://nyoeqsstyzjsvoxjalge.supabase.co')) {
            console.log('✅ DB Storage: imageUrl is a Supabase URL (Not Base64)');
        } else {
            console.log('❌ DB Storage: imageUrl is NOT a Supabase URL');
        }

        // Check 2: File extension in URL
        if (result.imageUrl.endsWith('.webp')) {
            console.log('✅ Format Conversion: URL ends with .webp');
        } else {
            console.log('❌ Format Conversion: URL does NOT end with .webp');
        }

        console.log('\nTest completed. Please check terminal logs for "Original vs Optimized" byte counts.');

    } catch (err) {
        console.error('❌ Test failed:', err.message);
    }
}

verifyOptimization();
