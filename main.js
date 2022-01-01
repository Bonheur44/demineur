(function() {
    /**
     * Partie I : Initialisation des variables
     */
    let container = document.querySelector('.container')
    let numberMines = document.querySelector('.header > div > i')
    let flag = document.querySelector('.header > i')
    let flagChecked = false

    let nbrMines = 35
    let minesCasesAdj = 0

    numberMines.innerHTML = nbrMines

    //Créer un tableau de mines à double dimension
    let tabMines = new Array(9)

    for (let i = 0; i < 9; i++) {
        tabMines[i] = new Array(9)
    }

    //Créer un tableau pour les div à double dimension
    let allDiv = new Array(9)

    for (let i = 0; i < 9; i++) {
        allDiv[i] = new Array(9)
    }

    /**
     * Méthode qui initialise le tableau de mines de façon aléatoire
     * @param {le nombre de mines} nbrMines
     */
    let initializeTabMines = (nbrMines) => {
        let i = 0, j = 0, n = nbrMines;
        while (n > 0) {
            i = Math.floor(Math.random()*9)
            j = Math.floor(Math.random()*9)
            if (tabMines[i][j] !== -1) {
                tabMines[i][j] = -1
                n--
            }
        }
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (tabMines[i][j] !== -1) tabMines[i][j] = 0
            }
        }
    }

    initializeTabMines(nbrMines)

    for (let i = 0; i < 9; i++) {
        allDiv[i] = document.createElement('div')
        allDiv[i].setAttribute('class', 'aRow')
        for (let j = 0; j < 9; j++) {
           allDiv[i][j] = document.createElement('div')
           allDiv[i].append(allDiv[i][j])
        }
        container.append(allDiv[i])
    }

    /**
     * Partie II : Place au jeu
     */

    /**
     * Méthode dig qui creuse une case
     * @param {la ligne} x
     * @param {la colonne} y
     * @returns le nombre de mines dans les cases adjacentes
     */
    let dig = (x, y) => {
        if (allDiv[x][y].lastChild != null && allDiv[x][y].lastChild.getAttribute('class') == 'bx bxs-flag') return
        let count = 0
        for (let i = x-1; i <= x+1; i++) {
            if (tabMines[i] !== undefined) {
                for (let j = y-1; j <= y+1; j++) {
                    if (tabMines[i][j] !== undefined) {
                        if (tabMines[i][j] == -1) count ++
                    }
                }
            }
        }
        allDiv[x][y].style.background = '#550055'
        allDiv[x][y].innerHTML = `<h3>${count}</h3>`
        return count
    }

    /**
     * Méthode digCaseAdj qui creuse les cases adjacentes si elles ne contiennent aucune mine
     * @param {la ligne} x
     * @param {la colonne} y
     */
    let digCaseAdj = (x, y) => {
        let count = dig(x, y)
        if (count == 0) {
            for (let i = x-1; i <= x+1; i++) {
                if (tabMines[i] !== undefined) {
                    for (let j = y-1; j <= y+1; j++) {
                        if (tabMines[i][j] !== undefined) {
                            dig(i, j)
                        }
                    }
                }
            }
        }
    }

    /**
     * Méthode stop qui s'exécute si le joueur perd
     */
    let stop = () => {
        container.innerHTML = 'Explosion'
    }

    /**
     * Méthode putAFlag qui pose un drapeau
     * @param {la ligne} i
     * @param {la colonne} j
     */
    let putAFlag = (i, j) => {
        allDiv[i][j].innerHTML = `<i class="bx bxs-flag"></i>`
        flag.setAttribute('class', 'bx bxs-flag')
        flagChecked = false
        if (tabMines[i][j] == -1) {
            nbrMines--
            numberMines.innerHTML = nbrMines
        }
    }
    
    /**
     * Méthode qui retire un drapeau s'il y en a
     * @param {la ligne} i 
     * @param {la colonne} j 
     * @returns true si drapeau retiré et false si aucun drapeau n'existe
     */
    let removeAFlag = (i, j) => {
        if (allDiv[i][j].lastChild != null && allDiv[i][j].lastChild.getAttribute('class') == 'bx bxs-flag') {
            allDiv[i][j].innerHTML = ''
            allDiv[i][j].style.background = '#fff'
            if (tabMines[i][j] == -1) {
                nbrMines++
                numberMines.innerHTML = nbrMines
            }
            return true
        }
        return false
    }

    /**
     * Écouteur de clic sur le drapeau pour en poser ou non
     */
    flag.addEventListener('click', () => {
        if (flag.getAttribute('class') == 'bx bxs-flag') {
            flag.setAttribute('class', 'bx bx-flag')
            flagChecked = true
        } else if (flag.getAttribute('class') == 'bx bx-flag') {
            flag.setAttribute('class', 'bx bxs-flag')
            flagChecked = false
        }
    })

    let gagner = () => {
        if (nbrMines != 0) return
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (allDiv[i][j].lastChild != null && allDiv[i][j].lastChild.getAttribute('class') == 'bx bxs-flag') {
                    if (tabMines[i][j] !== -1)
                    return
                }
            }
        }
        setTimeout(() => {
            container.innerHTML = 'Gagné'
        }, 300)
        return
    }

    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            allDiv[i][j].addEventListener('click', () => {
                allDiv[i][j].style.background = '#550055'
                if (removeAFlag(i, j)) {
                    gagner()
                    return
                }
                else if (flagChecked) {
                    putAFlag(i, j)
                } else if (tabMines[i][j] == -1) {
                    stop()
                } else {
                    digCaseAdj(i, j)
                }
                gagner()
            })
        }
    }

})()