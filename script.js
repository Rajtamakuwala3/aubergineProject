let allUniversities = [];
let filteredUniversities = [];

async function fetchUniversities() {
    const country = document.getElementById('country-input').value.trim();
    if (country) {
        try {
            const response = await fetch(`http://universities.hipolabs.com/search?country=${country}`);
            if (!response.ok) {
                throw new Error('Failed to fetch universities');
            }
            allUniversities = await response.json();
            displayUniversities(allUniversities);
            populateProvinces(allUniversities);
        } catch (error) {
            console.error('Error fetching universities:', error);
            alert('Failed to fetch universities. Please try again.');
        }
    } else {
        resetDisplay();
    }
}

function resetDisplay() {
    document.getElementById('university-cards').innerHTML = '';
    document.getElementById('province-dropdown').innerHTML = '<option value="">Select Province</option>';
}

function populateProvinces(universities) {
    const provinces = [...new Set(universities.map(u => u['state-province']).filter(Boolean))];
    const dropdown = document.getElementById('province-dropdown');
    dropdown.innerHTML = '<option value="">Select Province</option>';
    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        dropdown.appendChild(option);
    });
}

function filterByProvince() {
    const province = document.getElementById('province-dropdown').value;
    if (province) {
        filteredUniversities = allUniversities.filter(u => u['state-province'] === province);
        displayUniversities(filteredUniversities);
    } else {
        displayUniversities(allUniversities);
    }
}

function displayUniversities(universities) {
    const cardsContainer = document.getElementById('university-cards');
    cardsContainer.innerHTML = '';
    universities.forEach(university => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="images/u1.jpeg" alt="${university.name} Image" style="width:100%; height:auto;">
            <h3>${university.name}</h3>
            <p><a href="${university.web_pages[0]}" target="_blank">Visit Website</a></p>
            <button onclick="downloadCard('${university.name}', '${university.web_pages[0]}')">Download</button>
        `;
        cardsContainer.appendChild(card);
    });
}

function downloadCard(name, link) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 200;
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#000';
    context.font = 'bold 20px Arial';
    context.fillText(name, 10, 50);
    context.font = '16px Arial';
    context.fillText(link, 10, 90);
    canvas.toBlob(function(blob) {
        const linkElement = document.createElement('a');
        linkElement.href = URL.createObjectURL(blob);
        linkElement.download = `${name}.jpg`;
        linkElement.click();
    }, 'image/jpeg');
}
