document.addEventListener('DOMContentLoaded', function() {
    // Active navigation link
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const hero = document.getElementById('hero');
    const apiKey = '54618784f5bb8b94c22fe118ef74b2ab';
    const tvId = '119051';
    const creditsUrl = `https://api.themoviedb.org/3/tv/${tvId}/credits?api_key=${apiKey}`;

    // Home page specific logic
    if (currentPage === 'index.html' || currentPage === '') {
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
    }

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

    // Cast page logic
    if (currentPage === 'cast.html') {
        const castContainer = document.querySelector('.cast-container');
        const characterBios = {
            "Wednesday Addams": "A brilliant and morbid teenager with psychic abilities. She is sent to Nevermore Academy, where she uncovers a dark mystery.",
            "Enid Sinclair": "Wednesday's cheerful and colorful werewolf roommate at Nevermore Academy. She is the opposite of Wednesday in every way, but becomes her closest friend.",
            "Xavier Thorpe": "A charismatic and mysterious student at Nevermore with the ability to bring his art to life. He is a potential love interest for Wednesday.",
            "Tyler Galpin": "A 'normie' who works as a barista in the town of Jericho. He develops a complicated relationship with Wednesday.",
            "Bianca Barclay": "The queen bee of Nevermore, a siren with a mysterious past. She initially clashes with Wednesday but later becomes an ally.",
            "Larissa Weems": "The glamorous and imposing principal of Nevermore Academy. She is a former classmate of Morticia Addams and has a complex history with the family.",
            "Dr. Valerie Kinbott": "A therapist in Jericho who sees Wednesday as a patient. She is fascinated by Wednesday's unique psyche.",
            "Sheriff Donovan Galpin": "The sheriff of Jericho and Tyler's father. He is suspicious of Nevermore Academy and its students.",
            "Eugene Otinger": "A quirky student at Nevermore and the president of the beekeeping club. He quickly befriends Wednesday.",
            "Morticia Addams": "Wednesday's elegant and loving mother. She is a powerful psychic and an alumna of Nevermore Academy."
        };

        if (castContainer) {
            fetch(creditsUrl)
                .then(response => response.json())
                .then(data => {
                    const cast = data.cast.slice(0, 10); // Get top 10 cast members
                    cast.forEach(member => {
                        if (member.profile_path) {
                            const card = document.createElement('div');
                            card.classList.add('cast-card');

                            const bio = characterBios[member.character] || "No biography available.";

                            card.innerHTML = `
                                <img src="https://image.tmdb.org/t/p/w300${member.profile_path}" alt="${member.name}">
                                <div class="cast-card-content">
                                    <h3>${member.character}</h3>
                                    <p class="actor-name">Played by ${member.name}</p>
                                    <p>${bio}</p>
                                </div>
                            `;
                            castContainer.appendChild(card);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching credits:', error);
                    castContainer.innerHTML = '<p>Error loading cast information. Please try again later.</p>';
                });
        }
    }
});
