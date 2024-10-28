def factorNumber1(exponent, guess):
    factor = guess**(exponent//2)-1
    return factor

def getNumber():
    number = "0"
    while(not number.isdigit() or (int)(number)%2 == 0 or (int)(number) % ((int)(number)**0.5) == 0):
        number = input("Enter a number to factor: ")
    number = int(number)
    return number

def checkFits(number, guess):
    print("Checking for a guess that fits the number...")
    guess -=2
    exponent = 1
    while (exponent % 2 != 0):
        guess += 2
        newNum = guess
        print(f"Guess: {guess}")
        while (newNum % number != 1 or factorNumber1(exponent, guess) % number == 0):
            newNum *= guess
            exponent += 1
    result = guess**exponent
    print(f"{guess}^{exponent} = {result}")
    print(f"{result}mod({number}) = 1")
    print(f"Exponent: {exponent}")
    return exponent, guess

#Factors bad guess into number that share a factor with the original number
def factorNumber(exponent, guess):
    print("Factoring the guess...")
    factor = guess**(exponent//2)-1
    print(f"Factor = {guess}^({exponent}/2) - 1 = {factor}")
    return factor

#Efficiently finds the gcd of two numbers
def euclideanAlgorithm(num1, num2): 
    print("Finding the GCD...")
    if num2 > num1:
        num1, num2 = num2, num1
    while (num1 % num2 != 0):
        num1, num2 = num2, num1 % num2
    print(f"GCD: {num2}")
    return num2

num1 = getNumber()

#Finds the exponent and guess that will work for the number to create 
#a guess to the power of the exponent is congruent to 1 mod number
exponent, guess = checkFits(num1, 8)

#Finds the two numbers that share a factor with the original number
#by using the difference of squares formula
num2 = factorNumber(exponent, guess)

#Finds the prime factors of the original number by
#using the Euclidean Algorithm to find the GCD of the original number
#and the number that shares a factor with it
factor1 = euclideanAlgorithm(num1, num2)
factor2 = num1 // factor1

print(f"Prime factors: {factor1}, {factor2}")