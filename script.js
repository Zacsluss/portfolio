document.addEventListener('DOMContentLoaded', function () {
  
    // Hide the loading spinner once the DOM is fully loaded
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner !== null) {
      loadingSpinner.style.display = 'none';
    }
    // Vanta.js Fog Configuration
    VANTA.FOG({
      el: "#header",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xe67d07,
      midtoneColor: 0xff4123,
      lowlightColor: 0x7820fa,
      blurFactor: 0.34,
      speed: 0.80,
      zoom: 1.10
    });

     // Vanta.js Clouds Configuration
    VANTA.CLOUDS({
      el: "#your-element-selector",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      skyColor: 0x53b7de,
      cloudColor: 0xc4c5c5,
      sunColor: 0xff9714,
      sunGlareColor: 0xff602b,
      sunlightColor: 0xff9226,
      speed: 0.80
    });

  // Make the down-arrow visible after 3 seconds
  setTimeout(() => {
    const downArrow = document.getElementById('down-arrow');
    if (downArrow !== null) {
      downArrow.style.opacity = '1';
  
    // Add click event listener for smooth scroll to 'about-me' section
    downArrow.addEventListener('click', function() {
      const aboutMeSection = document.getElementById('about-me');
      if (aboutMeSection !== null) {
        aboutMeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    }
  }, 3000);

  // Array of descriptions
  const descriptions = [
    'Lead CRM Systems Analyst',
    'Certified Salesforce Platform Administrator',
    'AI Virtuoso',
    'Digital Artist',
    'FAA Lic. Remote Pilot',
    'Serial Entreprenuer',
    'Music Producer'
  ];

  // Index and character index initialization
  let index = 0;
  let charIndex = 0;
  const subtitleElement = document.getElementById('subtitle');

  // Function to type the descriptions
  function typeWriter() {
    if (charIndex === 0) {
      subtitleElement.innerHTML = '';
    }
    if (charIndex < descriptions[index].length) {
      subtitleElement.innerHTML += descriptions[index].charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 100);  // Delay between typing characters
    } else {
      setTimeout(() => {
        subtitleElement.innerHTML = '';
        charIndex = 0;
        index = (index + 1) % descriptions.length;
        typeWriter();
      }, 2000);  // Delay between changing descriptions
    }
  }

  // Initial call to typeWriter
  typeWriter();
});

