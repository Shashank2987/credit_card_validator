# credit_card_validator
# Credit Card Validator in C++

A simple C++ program that validates credit card numbers using the Luhn Algorithm.
The program checks whether a card number is valid and identifies the card type based on known prefixes.
---
## Overview

This project demonstrates how credit card numbers can be validated using the **Luhn Algorithm**, a widely used checksum formula employed by banks and payment processors to detect invalid card numbers.

The program accepts a card number from the user, verifies whether it is valid, and determines the card network based on its starting digits.

---

## Features

* Credit card validation using the **Luhn Algorithm**
* Detection of major card networks:

  * Visa
  * MasterCard
  * American Express
* Masked display of card numbers for safer output
* Display Issuer Info (Bank Name, Country Of Origin)
* Simple and readable console interface
* Implemented entirely in a single C++ source file (`main.cpp`)

---

## How the Validation Works

The program uses the **Luhn Algorithm**, which follows these steps:

1. Starting from the rightmost digit, double every second digit.
2. If doubling results in a number greater than 9, subtract 9.
3. Add all digits together.
4. If the total sum is divisible by 10, the card number is considered valid.
5. If Valid,
    - Card Netwrok is checked using prefix rule
    - Bank Name is identifies using BIN Lookup using first 6 digits
    - Issuer Country is displayed
6. Card Number is displayed in masked format for security

This method helps detect common typing errors and invalid numbers.

---

## Example Output

```
-----Credit Card Validator-----
Enter Your Credit Card Number: 4532015112830366

=============================
Card Number : ************0366
Validation Result: VALID
Card Type : Visa
Bank Name: JPMorgan Chase
Country  : USA
=============================
```

---

## Compilation

Compile the program using a C++ compiler such as **g++**:

```
g++ main.cpp -o validator
```

Run the program:

```
./validator
---

## Technologies Used

* C++
* Standard Library (`iostream`, `string`,'vector')

---

## License

This project is intended for educational and learning purposes.
