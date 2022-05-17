class Round {
    constructor() {
        this.round = 1
        this.correctAnswer = 0
        this.totalRounds = 5
    }

    get getRound() {
        return this.round
    }

    get getCorrectAnswer() {
        return this.correctAnswer
    }

    get getTotalRounds() {
        return this.totalRounds
    }

    get getPercentScore() {
        return ((this.getCorrectAnswer / this.totalRounds) * 100).toFixed(2)
    }

    incrementRound() {
        this.round ++
    }

    incrementCorrectAnswer() {
        this.correctAnswer ++
    }

}

class Question {
    constructor() {
        this.totalOptions = 4
        this.intervalWrongAnswers = [-20, +20]
        this.num1 = this.generateRandomNumber()
        this.num2 = this.generateRandomNumber()
        this.operator = this.pickRandomOperator()
        this.result = this.generateResult()
        this.letters = ['a', 'b', 'c', 'd']
        this.answers = this.generateAnswers()
        this.correctLetter = this.searchCorrectLetter()
    }

    get getAnswers() {
        return this.answers
    }

    get getLetters() {
        return this.letters
    }

    get getQuestion() {
        return `${this.num1} ${this.operator} ${this.num2}`
    }
    
    get getCorrectLetterUpper() {
        return this.correctLetter.toUpperCase()
    }

    searchCorrectLetter() {
        return this.letters[this.answers.indexOf(this.result)] 
    }

    generateRandomNumber() {
        return Math.floor(Math.random() * 101)      
    }  

    pickRandomOperator() {
        const operator = Math.floor(Math.random() * 3) + 1     
        if (operator == 1) {return '+'}
        if (operator == 2) {return '-'}
        if (operator == 3) {return 'x'}
        return None         
    }   

    generateResult() {
        if (this.operator == '+') {return this.num1 + this.num2}
        if (this.operator == '-') {return this.num1 - this.num2}
        if (this.operator == 'x') {return this.num1 * this.num2}
        return None              
    } 

    generateAnswers() {     
        const generateRandomNumber = () => {
            const [intervalMin, intervalMax] = this.intervalWrongAnswers
            const min = this.result + intervalMin
            const max = this.result + intervalMax
    
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        const containsRandomNumberAlready = randomNumber => answers.includes(randomNumber)
        
        // choose a random position in array to receive the correct answer
        const correctOptionPosition = Math.floor(Math.random() * this.totalOptions);

        let answers = []
        for (let i=0; i<this.totalOptions;i++) {
            
            if (i == correctOptionPosition) {
                answers.push(this.result)
            }
            // generate random answer
            else {
                let randomNumber = 0

                do {
                    randomNumber = generateRandomNumber()
                }
                while ((randomNumber == this.result) || containsRandomNumberAlready(randomNumber))

                answers.push(randomNumber)   
            }
        }
        return answers
    }
}

function newQuestion(round) {

    return new Promise((resolve, reject) => {

        question = new Question()

        const question_id = document.querySelector("#id-question")
        const question_txt = document.querySelector("#question-display")

        question_id.textContent = round.getRound
        question_txt.textContent = question.getQuestion

        // clean options
        const buttons = document.querySelectorAll("#quiz-answer button")
        buttons.forEach( btn => btn.remove())

        // load options
        const quizAnswer = document.querySelector("#quiz-answer")

        question.getLetters.forEach( function callback(letter, index) {
            const answerTemplate = document.querySelector('.answer-template').cloneNode(true)
            const optionLetter = answerTemplate.querySelector('.option-letter')
            const optionAnswer = answerTemplate.querySelector('.option-answer')

            optionLetter.textContent = letter
            optionAnswer.textContent = question.getAnswers[index]

            answerTemplate.classList.remove("hide")
            answerTemplate.classList.remove("answer-template")
            quizAnswer.appendChild(answerTemplate)

            // check correct answer
            answerTemplate.addEventListener("click", function() {
                const letterClick = this.querySelector(".option-letter").innerText
                const letterCorrect = question.getCorrectLetterUpper
                        
                const buttons = document.querySelectorAll("#quiz-answer button")
                const gotCorrectAnswer = (letterClick == letterCorrect)
                buttons.forEach( btn => {
                    const optionLetter = btn.querySelector(".option-letter").innerText

                    if (optionLetter == letterCorrect) {
                        btn.classList.add("correct-answer")
                    } else {
                        btn.classList.add("wrong-answer")
                    }

                    setTimeout(()=>{
                        resolve(gotCorrectAnswer)
                    }, 1000)
                })
            })
        }) 
    }) 
}

function hideOrShowQuiz() {
    const quizContainer = document.querySelector("#quiz-container")
    const scoreContainer = document.querySelector("#score-container")

    quizContainer.classList.toggle("hide")
    scoreContainer.classList.toggle("hide")
}

function showScore(round) {
    const scorePercent = document.querySelector("#score-percent span")
    const totalCorrect = document.querySelector("#total-correct-answer")
    const totalQuestion = document.querySelector("#total-questions")

    hideOrShowQuiz()

    scorePercent.textContent = round.getPercentScore
    totalCorrect.textContent = round.getCorrectAnswer
    totalQuestion.textContent = round.totalRounds
}

async function startGame(){
    round = new Round()

    for (i=0; i<round.totalRounds; i++) {
        const result = await newQuestion(round)
        if (result) { round.incrementCorrectAnswer() }
        round.incrementRound()
    }

    showScore(round)
}

startGame()

const restartBtn = document.querySelector("#restart")

restartBtn.addEventListener("click", function() {
    hideOrShowQuiz()

    startGame()
})



