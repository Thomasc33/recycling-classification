import React from 'react'
import ParticlesElement from '../Components/Particles'
import '../css/Page-Template.css';

class PageTemplate extends React.Component {
    constructor(props) {
        super(props)
        this.props = props
    }
    render() {
        return (
            <div className="App">
                <ParticlesElement />
                <div className='Header'>
                    <ul>
                        <li>
                            <a className={this.props.highLight === "0" ? "active" : ""} href='/'>Try It!</a>
                        </li>
                        <li>
                            <a className={this.props.highLight === "1" ? "active" : ""} href='about'>About</a>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}

export default PageTemplate