async function uploadImage() {
    const input = document.getElementById('uploadInput');
    const file = input.files[0];

    if (!file) {
        alert("Please select an image file.");
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:8000/detect_season/', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        // Display the uploaded image
        const uploadedImage = document.getElementById('uploadedImage');
        uploadedImage.style.display = 'block';
        uploadedImage.src = URL.createObjectURL(file);
        
        // Set dropdown values based on detected data
        const undertoneSelect = document.getElementById('undertoneSelect');
        const irisColorSelect = document.getElementById('irisColorSelect');
        const hairColorSelect = document.getElementById('hairColorSelect');
        const skinColorSelect = document.getElementById('skinColorSelect');

        undertoneSelect.value = data.undertone.toLowerCase();
        irisColorSelect.value = data.iris_color.toLowerCase();
        hairColorSelect.value = data.hair_color.toLowerCase();
        skinColorSelect.value = data.skin_color.toLowerCase();

        // Display the dropdowns
        const selectionContainer = document.getElementById('selectionContainer');
        selectionContainer.style.display = 'block';

        // Hide the button container
        const buttonContainer = document.getElementById('buttonContainer');
        buttonContainer.style.display = 'none';

        // Display the detected season
        const seasonText = document.getElementById('seasonText');
        seasonText.innerText = `Detected Season: ${data.season}`;
        seasonText.classList.remove('loading');

        // Show the color palette
        document.getElementById('colorPaletteContainer').style.display = 'block';
        displayColorPalette(data.suggested_colors);
    } catch (error) {
        console.error('Error:', error);
        alert("Error detecting season.");
    }
}

async function detectSeasonWithSelections() {
    const undertoneSelect = document.getElementById('undertoneSelect');
    const irisColorSelect = document.getElementById('irisColorSelect');
    const hairColorSelect = document.getElementById('hairColorSelect');
    const skinColorSelect = document.getElementById('skinColorSelect');

    const undertone = undertoneSelect.value;
    const irisColor = irisColorSelect.value;
    const hairColor = hairColorSelect.value;
    const skinColor = skinColorSelect.value;

    try {
        const response = await fetch('http://localhost:8000/detect_season_with_selections/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                undertone: undertone,
                iris_color: irisColor,
                hair_color: hairColor,
                skin_color: skinColor
            })
        });

        const data = await response.json();
        
        // Display the detected season
        const seasonText = document.getElementById('seasonText');
        seasonText.innerText = `Detected Season: ${data.season}`;
        seasonText.classList.remove('loading');

        // Show the color palette
        document.getElementById('colorPaletteContainer').style.display = 'block';
        displayColorPalette(data.suggested_colors);
    } catch (error) {
        console.error('Error:', error);
        alert("Error detecting season with selections.");
    }
}

function uploadAnotherImage() {
    // Reset the form to upload another image
    document.getElementById('uploadInput').value = '';
    document.getElementById('uploadedImage').style.display = 'none';
    document.getElementById('selectionContainer').style.display = 'none';
    document.getElementById('seasonText').innerText = '';
    document.getElementById('buttonContainer').style.display = 'none';
    document.getElementById('colorPaletteContainer').style.display = 'none';
}

function proceedToRecommendations() {
    // Redirect to the recommendations page
    window.location.href = 'recommendations.html';
}

function displayColorPalette(colors) {
    console.log("Displaying color palette with colors:", colors);

    const colorPaletteContainer = document.getElementById('colorPaletteContainer');
    colorPaletteContainer.innerHTML = '';

    colors.forEach(color => {
        const colorCircle = document.createElement('div');
        colorCircle.classList.add('colorCircle');
        colorCircle.style.backgroundColor = color;
        colorPaletteContainer.appendChild(colorCircle);
    });

    console.log("Color palette displayed successfully.");
}
