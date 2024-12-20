import { useNavigate } from 'react-router-dom';
import './OurTeam.css';
import { useRef, useEffect } from 'react';

const OurTeam = () => {
    const elementsRef = useRef([]);
    const navigate = useNavigate();

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
        <div className="our-team">
            <header onClick={() => navigate('/')}>
                <img src="/icons/tcu_airlines-logo (2).png" alt="" />
                <h3>CLOUDPEAK <span>AIRLINES</span></h3>
            </header>
            <div class="container" ref={el => elementsRef.current[0] = el}>
                <h1>Developer Team</h1>
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
                    <div class="gallery">
                        <img src="/members/Design Team/SALUDE, ABBA.jpg" alt="Profile" />
                        <div>
                            <h3>Abba Faith Salude</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Design Team/Regaspi, Kristine.jpg" alt="Profile" />
                        <div>
                            <h3>Abba Faith Salude</h3>
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
                        <img src="/members/Research Team/Sanchez, Van.jpeg" alt="Profile" />
                        <div>
                            <h3>Vandondale Sanchez</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Salamat_Jamil.jpg" alt="Profile" />
                        <div>
                            <h3>Jamil Salamat</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Salde, John Oliver.png" alt="Profile" />
                        <div>
                            <h3>John Oliver Salde</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/adrian, querubin.jpg" alt="Profile" />
                        <div>
                            <h3>Adrian Querubin</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Richard Tamondong, research team .jpeg" alt="Profile" />
                        <div>
                            <h3>Richard Tamondong</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Pacto, Rafael C.jpg" alt="Profile" />
                        <div>
                            <h3>Rafael Pacto</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Ponce, Mikkel.png" alt="Profile" />
                        <div>
                            <h3>Mikkel Ponce</h3>
                        </div>
                    </div>
                    <div class="gallery">
                        <img src="/members/Research Team/Valiente, Jasmin.jpg" alt="Profile" />
                        <div>
                            <h3>Jasmin Valiente</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OurTeam