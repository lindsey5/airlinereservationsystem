import './About.css';
import { useRef, useEffect } from 'react';

const About = () => {
    const elementsRef = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                } else {
                    entry.target.classList.remove('animate');
                }
            });
          },
          { threshold: 0 }
        );
    
        elementsRef.current.forEach((el) => {
            if (el) {
                observer.observe(el);
            }
          });
        return () => observer.disconnect();
      }, []);

    return(
        <div className="about">
            <div class="container" ref={el => elementsRef.current[0] = el}>
                <h1>Programming Team</h1>
                <div class="gallery-container">
                    <div class="gallery">
                        <img src="/members/Programming Team/aaron.JPG" alt="Profile" />
                        <div>
                        <h3>Francis Aaron Rodriguez</h3>
                        <p>Leader</p>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Programming Team/lindsey.png" alt="Profile" />
                        <div>
                            <h3>Lindsey Samson</h3>
                            <p>Lead Programmer</p>
                        </div>
                    </div>
                </div>
                <div className='gallery-container'>
                    <div class="gallery">
                        <img src="/members/Programming Team/Retrita,karl.jpeg" alt="Profile" />
                        <div>
                            <h3>Karl Retrita</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Programming Team/Rabaño, John Paul.jpg" alt="Profile" />
                        <div>
                            <h3>John Paul Rabaño</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" ref={el => elementsRef.current[1] = el}>
                <h1>Design Team</h1>
                <div class="gallery-container">
                    <div class="gallery">
                        <img src="/members/Design Team/UPO, KEITH.jpg" alt="Profile" />
                        <div>
                            <h3>Keith Upo</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Design Team/Razon, Vener E.jpg" alt="Profile" />
                        <div>
                            <h3>Vener Razon</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Design Team/HENRY SALIGAN.jpg" alt="Profile" />
                        <div>
                            <h3>Henry Saligan</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" ref={el => elementsRef.current[2] = el}>
                <h1>Research Team</h1>
                <div class="gallery-container">
                    <div class="gallery">
                        <img src="/members/Research Team/daniel, suarez.jpg" alt="Profile" />
                        <div>
                            <h3>Daniel Suarez</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/adrian, querubin.jpg" alt="Profile" />
                        <div>
                            <h3>Adrian Querubin</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Salamat_Jamil.jpg" alt="Profile" />
                        <div>
                            <h3>Jamil Salamat</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Richard Tamondong, research team .jpeg" alt="Profile" />
                        <div>
                            <h3>Richard Tamondong</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default About