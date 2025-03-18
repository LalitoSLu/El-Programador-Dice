const round = document.getElementById('round');
const simonButtons = document.getElementsByClassName('square');
const startButton = document.getElementById('startButton');

class Simon {
    constructor(simonButtons, startButton, round) {
        this.round = 0;
        this.userPosition = 0;
        this.totalRounds = 10;
        this.sequence = [];
        this.speed = 1000;
        this.blockedButtons = true;
        this.buttons = Array.from(simonButtons);
        this.display = { startButton, round };
        this.errorSound = new Audio('./sounds/error.wav');
        this.buttonSounds = [
            new Audio('./sounds/1.mp3'),
            new Audio('./sounds/2.mp3'),
            new Audio('./sounds/3.mp3'),
            new Audio('./sounds/4.mp3'),
        ];
        this.questions = [
            { 
                question: "¿Qué significa API?", 
                explanation: "Las APIs permiten la comunicación entre diferentes aplicaciones.",
                options: ["Application Programming Interface", "Advanced Program Integration", "Automated Process Interaction"], 
                answer: "Application Programming Interface" 
            },
            { 
                question: "¿Cuál de estos métodos HTTP se usa para enviar datos a un servidor?", 
                explanation: "Los métodos HTTP indican la acción a realizar en una solicitud.",
                options: ["GET", "POST", "DELETE"], 
                answer: "POST" 
            },
            { 
                question: "¿Cuál es el sistema de archivos de Linux?", 
                explanation: "Este sistema de archivos organiza los datos en los sistemas operativos basados en Unix.",
                options: ["NTFS", "EXT4", "FAT32"], 
                answer: "EXT4" 
            },
            { 
                question: "¿Qué es un framework?", 
                explanation: "Un framework proporciona una base de código predefinida para desarrollar software más rápido.",
                options: ["Un entorno de desarrollo", "Un conjunto de librerías", "Una herramienta para administrar bases de datos"], 
                answer: "Un conjunto de librerías" 
            },
            { 
                question: "¿Qué es JSON?", 
                explanation: "JSON es un formato ligero para el intercambio de datos.",
                options: ["Un lenguaje de programación", "Un formato de intercambio de datos", "Un sistema operativo"], 
                answer: "Un formato de intercambio de datos" 
            },
            { 
                question: "¿Cuál es el propósito de un servidor web?", 
                explanation: "Un servidor web responde a las solicitudes de los clientes y envía páginas web.",
                options: ["Almacenar bases de datos", "Ejecutar aplicaciones locales", "Servir contenido web"], 
                answer: "Servir contenido web" 
            },
            { 
                question: "¿Qué lenguaje es popular para desarrollo móvil en Android?", 
                explanation: "Este lenguaje es uno de los principales usados para crear apps en Android.",
                options: ["Swift", "Kotlin", "C#"], 
                answer: "Kotlin" 
            },
            { 
                question: "¿Qué comando de Git se usa para clonar un repositorio?", 
                explanation: "Este comando permite copiar un repositorio remoto a tu máquina local.",
                options: ["git commit", "git clone", "git merge"], 
                answer: "git clone" 
            },
            { 
                question: "¿Qué es Docker?", 
                explanation: "Docker permite empaquetar aplicaciones con todas sus dependencias en contenedores.",
                options: ["Un lenguaje de programación", "Una herramienta de virtualización", "Un sistema operativo"], 
                answer: "Una herramienta de virtualización" 
            },
            { 
                question: "¿Qué tipo de base de datos es MySQL?", 
                explanation: "MySQL es una base de datos que almacena información en tablas con relaciones.",
                options: ["NoSQL", "Relacional", "Documental"], 
                answer: "Relacional" 
            },
            { 
                question: "¿Cuál es el propósito de un CDN?", 
                explanation: "Un CDN ayuda a mejorar la velocidad de carga de los sitios web distribuyendo el contenido.",
                options: ["Almacenar datos en servidores locales", "Acelerar la entrega de contenido web", "Realizar copias de seguridad"], 
                answer: "Acelerar la entrega de contenido web" 
            },
            { 
                question: "¿Qué significa HTTPS?", 
                explanation: "HTTPS es un protocolo seguro para la transferencia de datos en la web.",
                options: ["HyperText Transfer Protocol Secure", "High Transfer Text Security", "Hyper Terminal Transfer System"], 
                answer: "HyperText Transfer Protocol Secure" 
            },
            { 
                question: "¿Cuál es la principal ventaja de TypeScript sobre JavaScript?", 
                explanation: "TypeScript es un superset de JavaScript que agrega tipado estático.",
                options: ["Es más rápido", "Tiene tipado estático", "Se ejecuta en el navegador sin compilación"], 
                answer: "Tiene tipado estático" 
            },
            { 
                question: "¿Qué es una función en programación?", 
                explanation: "Una función es un bloque de código que se puede reutilizar.",
                options: ["Un tipo de dato", "Un bloque de código reutilizable", "Un operador lógico"], 
                answer: "Un bloque de código reutilizable" 
            },
            { 
                question: "¿Cuál de estas opciones es un sistema de control de versiones?", 
                explanation: "Un sistema de control de versiones permite rastrear cambios en el código.",
                options: ["WordPress", "Git", "Jenkins"], 
                answer: "Git" 
            }
            
        ];
    }

    init() {
        this.display.startButton.onclick = () => this.startGame();
    }

    startGame() {
        this.display.startButton.disabled = true;
        this.updateRound(0);
        this.userPosition = 0;
        this.sequence = this.createSequence();
        this.buttons.forEach((element, i) => {
            element.classList.remove('winner');
            element.onclick = () => this.buttonClick(i);
        });
        this.showSequence();
    }

    updateRound(value) {
        this.round = value;
        this.display.round.textContent = `Round ${this.round}`;
    }

    createSequence() {
        return Array.from({ length: this.totalRounds }, () => this.getRandomColor());
    }

    getRandomColor() {
        return Math.floor(Math.random() * 4);
    }

    buttonClick(value) {
        if (!this.blockedButtons) {
            this.validateChosenColor(value);
        }
    }

    validateChosenColor(value) {
        if (this.sequence[this.userPosition] === value) {
            this.buttonSounds[value].play();
            if (this.round === this.userPosition) {
                this.updateRound(this.round + 1);
                this.speed /= 1.02;
                this.isGameOver();
            } else {
                this.userPosition++;
            }
        } else {
            this.askQuestion();
        }
    }

    isGameOver() {
        if (this.round === this.totalRounds) {
            this.gameWon();
        } else {
            this.userPosition = 0;
            this.showSequence();
        }
    }

    showSequence() {
        this.blockedButtons = true;
        let sequenceIndex = 0;
        let timer = setInterval(() => {
            const button = this.buttons[this.sequence[sequenceIndex]];
            this.buttonSounds[this.sequence[sequenceIndex]].play();
            this.toggleButtonStyle(button);
            setTimeout(() => this.toggleButtonStyle(button), this.speed / 2);
            sequenceIndex++;
            if (sequenceIndex > this.round) {
                this.blockedButtons = false;
                clearInterval(timer);
            }
        }, this.speed);
    }

    toggleButtonStyle(button) {
        button.classList.toggle('active');
    }

    askQuestion() {
        this.errorSound.play();
        this.blockedButtons = true;
    
        const randomQuestion = this.questions[Math.floor(Math.random() * this.questions.length)];
        const modal = document.getElementById("questionModal");
        const questionText = document.getElementById("questionText");
        const explanationText = document.getElementById("explanationText");
        const optionsContainer = document.getElementById("optionsContainer");
    
        questionText.textContent = randomQuestion.question;
        explanationText.textContent = randomQuestion.explanation;
        optionsContainer.innerHTML = "";
    
        randomQuestion.options.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.classList.add("option-button");
            button.onclick = () => {
                if (option === randomQuestion.answer) {
                    modal.style.display = "none";
                    this.blockedButtons = false;
                    this.showSequence();
                } else {
                    document.getElementById("errorModal").classList.remove("hidden");
                    setTimeout(() => {
                        this.gameLost();
                    }, 2000);
                }
            };
            optionsContainer.appendChild(button);
        });
    
        modal.style.display = "flex";
    }

    gameLost() {
        this.display.startButton.disabled = false;
        this.blockedButtons = true;
        this.updateRound(0);
        this.sequence = [];
        this.userPosition = 0;

        // Asegurar que se ocultan los modales de error y preguntas
        document.getElementById("questionModal").style.display = "none";
        document.getElementById("errorModal").classList.add("hidden");
    }

    gameWon() {
        this.display.startButton.disabled = false;
        this.blockedButtons = true;
        this.buttons.forEach(element => {
            element.classList.add('winner');
        });
        this.updateRound('🏆');
    }
}

const simon = new Simon(simonButtons, startButton, round);
simon.init();

document.getElementById('startGame').addEventListener('click', function() {
    document.getElementById('inicio').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
});

document.getElementById('goBack').addEventListener('click', function() {
    document.getElementById('game').classList.add('hidden');
    document.getElementById('inicio').classList.remove('hidden');
});

document.getElementById("closeErrorModal").addEventListener("click", function() {
    document.getElementById("errorModal").classList.add("hidden");
    simon.gameLost(); // Reiniciar el juego al cerrar el mensaje
});
