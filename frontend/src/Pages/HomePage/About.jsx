import './About.css';


const About = () => {
    return(
        <div className="about">
            <div class="container" style={{display: 'flex', justifyContent: 'space-evenly'}}>
                <div class="gallery-container" style={{flexDirection: 'column'}}>
                    <h1>Leader</h1>
                    <div class="gallery">
                        <img src="/members/Programming Team/aaron.JPG" alt="Profile" />
                        <h3>Francis Aaron Rodriguez</h3>
                    </div>
                </div>
                <div class="gallery-container" style={{flexDirection: 'column'}}>
                    <h1>Lead Programmer</h1>
                    <div class="gallery">
                        <img src="/members/Programming Team/lindsey.png" alt="Profile" />
                        <h3>Lindsey Samson</h3>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default About