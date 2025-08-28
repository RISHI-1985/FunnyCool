document.addEventListener('DOMContentLoaded', function() {
    const hero = document.getElementById('hero');
    const apiKey = '54618784f5bb8b94c22fe118ef74b2ab';
    const tvId = '119051';
    const apiUrl = `https://api.themoviedb.org/3/tv/${tvId}/images?api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const images = data.backdrops;
            if (images && images.length > 0) {
                let currentIndex = 0;
                const showImage = () => {
                    if (!hero) return;
                    hero.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${images[currentIndex].file_path})`;
                    currentIndex = (currentIndex + 1) % images.length;
                };

                showImage();
                setInterval(showImage, 3000);
            }
        })
        .catch(error => {
            console.error('Error fetching images:', error);
            if (hero) {
                hero.innerHTML = '<p>Error loading images. Please try again later.</p>';
            }
        });

    const tiles = document.querySelectorAll('.tile');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    tiles.forEach(tile => {
        observer.observe(tile);
    });
});
