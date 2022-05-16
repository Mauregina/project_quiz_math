class Round {
    constructor() {
        this.round = 1
        this.totalRounds = 5
    }

    get getRound() {
        return this.round
    }

    get getTotalRounds() {
        return this.totalRounds
    }

    incrementRound() {
        this.round ++
    }
}

class Question {
    constructor() {
        this.totalOptions = 4
        this.intervalWrongAnswers = [-2, +2]
        this.operator = this.getRandomOperation()
        this.num1 = this.getRandomNumber()
        this.num2 = this.getRandomNumber()
        this.result = this.generateResult()
        this.letters = ['a', 'b', 'c', 'd']
        this.options = this.generateOptions()
    }

    get getNum1() {
        return this.num1
    }

    get getNum2() {
        return this.num2
    }

    get getOperator() {
        if (this.operator == 1) {return '+'}
        if (this.operator == 2) {return '-'}
        if (this.operator == 3) {return 'x'}
        return None
    }

    get getOptions() {
        return this.options
    }

    get getLetters() {
        return this.letters
    }

    get getResult() {
        return this.result
    }

    getRandomOperation() {
        return Math.floor(Math.random() * 3) + 1      
    } 

    getRandomNumber() {
        return Math.floor(Math.random() * 101)      
    }    

    generateResult() {
        if (this.operator == 1) {return this.num1 + this.num2}
        if (this.operator == 2) {return this.num1 - this.num2}
        if (this.operator == 3) {return this.num1 * this.num2}
        return None              
    } 

    generateOptions() {     
        const generateRandomNumber = () => {
            const [intervalMin, intervalMax] = this.intervalWrongAnswers
            const min = this.result + intervalMin
            const max = this.result + intervalMax
    
            return Math.floor(Math.random() * (max - min + 1)) + min
        }

        const containsRandomNumberAlready = (randomNumber) => {
            return array.includes(randomNumber)
        }
        
        // choose a random letter to receive the correct answer
        let correctOption = Math.floor(Math.random() * this.totalOptions);

        let array = []
        for (let i=0; i<this.totalOptions;i++) {
            
            if (i == correctOption) {
                array.push(this.result)
            }
            // generate random answer
            else {
                let randomNumber = 0

                do {
                    randomNumber = generateRandomNumber()
                }
                while ((randomNumber == this.result) || containsRandomNumberAlready(randomNumber))

                array.push(randomNumber)   
            }
        }
        return array
    }

    getQuestion() {
        return `${this.getNum1} ${this.getOperator} ${this.getNum2}`
    } 
}

function newQuestion(round) {
    question = new Question()

    const question_id = document.querySelector("#id-question")
    const question_txt = document.querySelector("#question-display")

    question_id.textContent = round.getRound
    question_txt.textContent = question.getQuestion()

    // clean options
    let buttons = document.querySelectorAll("#quiz-answer button")
    buttons.forEach( btn => btn.remove())

    // load options
    let quizAnswer = document.querySelector("#quiz-answer")

    question.getLetters.forEach( function callback(letter, index) {
        const answerTemplate = document.querySelector('.answer-template').cloneNode(true)
        const optionLetter = answerTemplate.querySelector('.option-letter')
        const optionAnswer = answerTemplate.querySelector('.option-answer')

        optionLetter.textContent = letter
        optionAnswer.textContent = question.getOptions[index]

        answerTemplate.classList.remove("hide")
        answerTemplate.classList.remove("answer-template")
        quizAnswer.appendChild(answerTemplate)
    })
}

function startGame() {
    round = new Round()

    newQuestion(round) 
    round.incrementRound()
}

startGame()



