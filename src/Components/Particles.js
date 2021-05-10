import React from 'react'
import Particles from 'react-tsparticles'

const particles = () => {
    return (
        <Particles
            width='100vw'
            height='100vh'
            options={{
                background: {
                    color: {
                        value: "#2C2F33"
                    },
                },
                fpsLimit: 60,
                interactivity: {
                    detectsOn: "window",
                    events: {
                        onHover: {
                            enable: true,
                            mode: "attract"
                        },
                        onClick: {
                            enabled: true,
                            mode: 'attract'
                        }
                    },
                    modes: {
                        attract: {
                            quantity: .1
                        },
                        grab: {
                            distance: 350
                        }
                    }
                },
                particles: {
                    number: {
                        value: 60,
                    },
                    color: {
                        value: "#8730d9"
                    },
                    links: {
                        color: "#99AAB5",
                        distance: 250,
                        enable: true,
                        opacity: .5,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: .3,
                        direction: 'random',
                        random: true
                    },
                }
            }}
        />
    )
}

export default particles