import math
import random

class LongDivision:
    
    def __init__(self):
        self.dividend_string = ""
        self.dividend = 0
        self.divisor = 1
        self.quotient = ""
        self.index_to_bring_down = 0
        self.answer_found = False
        self.game_state = "Setup"
        self.all_sub_numbers = []
        self.all_computed_products = []
        self.equation_state = ""
        self.overlined_dividend = ")"
        self.final_remainder = ""
        self.current_tries = 0

    # Get initial user input for which values to use for the division problem.
    def get_values_to_solve(self):
        input("Welcome to Class Hero Interactive Long Division! Press enter to continue.\n")
        while True:
            choice = input("Enter 1 for a random problem or 2 to choose your own.\n")
            if choice == "1":
                self.divisor = random.randint(10, 99)
                self.dividend = random.randint(400, 9999)
                self.dividend_string = str(self.dividend)
            elif choice == "2":
                self.dividend_string = input("Lets start by choosing a number to perform long division on. We call this the 'dividend'. Enter a dividend to use as a dividend and press enter.\n")
                try:
                    self.dividend = int(self.dividend_string)
                except ValueError:
                    print(f"Whoops! {self.dividend_string} is not a valid number. Try again.")
                    continue
                self.divisor = input("Nice choice! Now let's decide what to divide this dividend by. We call this the 'divisor' in long division. Enter a number to use as your divisor and press enter.\n")
                try:
                    self.divisor = int(self.divisor)
                except ValueError:
                    print(f"Whoops! {self.divisor} is not a valid number. Try again.")
                    continue
            else:
                continue      
            return 

    # Dynamically get overlined dividend
    def get_overlined_dividend(self):
        for i in self.dividend_string:
            self.overlined_dividend += f"{i}\u0305"
        # return overlined

    # Get initial number that is divisible by the dividend
    def get_smallest_number(self):
        to_evaluate = ""
        for i in self.dividend_string:
            to_evaluate += i
            to_evaluated_int = int(to_evaluate)
            remainder = to_evaluated_int%self.divisor
            if remainder != to_evaluated_int or remainder == 0:
                return to_evaluate

    # Dynamically aquire the equation's visual representation based on the game state
    def get_equation_state(self):
        if self.game_state == "Setup":
            self.equation_state += f"{self.divisor}{self.overlined_dividend}\n"
        elif self.game_state == "Short Division":
            if len(self.all_sub_numbers) == 1:
                self.equation_state = f"{self.top_offset}{self.quotient}\n" + self.equation_state
            else:
                index_to_replace = self.equation_state.index("\n")
                self.equation_state = f"{self.top_offset}{self.quotient}\n" + self.equation_state[index_to_replace+1:]
        elif self.game_state == "Subtraction":
            i = len(self.all_computed_products) - 1
            new_offset =((len(f"{self.divisor})") - 1)*(i+1))*" "
            to_add = f"{new_offset}-{self.all_computed_products[i]}\n{new_offset}{self.equals_line}\n"
            self.equation_state += to_add
        elif self.game_state == "Remainder":
            i = len(self.all_computed_products) + 1
            new_offset =((len(f"{self.divisor})") - 1)*i)*" "
            to_add = f"{new_offset}{self.all_sub_numbers[-1]}\n"
            self.equation_state += to_add
        elif self.game_state == "Game Over":
            i = len(self.all_computed_products) + 1
            new_offset =((len(f"{self.divisor})") - 1)*i)*" "
            to_add = f"{new_offset}{self.final_remainder}\n"
            self.equation_state += to_add

    # Play the game
    def play_game(self):
        while not self.answer_found:
            if self.game_state == "Setup":

                while self.divisor > self.dividend:
                    self.get_values_to_solve()
                    if self.divisor > self.dividend:
                        print("Whoops, your divisor is larger than your dividend! Try again using a divisor small than your dividend. Press enter to restart.\n")

                print("\nLooking good! We'll begin the problem with the following values:")
                print(f'Dividend: {self.dividend}')
                print(f'Divisor:  {self.divisor}\n')

                self.get_overlined_dividend()
                self.get_equation_state()

                print("When we set up a long division problem using our chosen dividend and divisor, it will look like this:\n")
                print(self.equation_state)
                print("\n")

                print(f"Our next step is going to be finding the smallest number (from left to right only) within our dividend ({self.dividend}) that our divisor ({self.divisor}) can go into without exceeding its value.")
                sub_number = input(f"What is the smallest number within {self.dividend} (from left to right) that {self.divisor} can go into without going over?\n")
                correct_answer = self.get_smallest_number()
                self.index_to_bring_down += len(correct_answer)

                while sub_number != correct_answer:
                    self.current_tries += 1
                    if self.current_tries > 3:
                        print(f"Hint: {correct_answer}")
                    sub_number = input("Not quite right, try again! What is the smallest number within the dividend (from left to right) that our divisor can go into?\n")
                self.all_sub_numbers.append(sub_number)
                self.current_tries = 0

                print(f"\nWell done! We know that the smallest sub-number is {sub_number}.\n")
                self.game_state = "Short Division"

            if self.game_state == "Short Division":
                current_sub_number = self.all_sub_numbers[-1]
                number_of_times = input(f"Time for short division! How many times can {self.divisor} go into {current_sub_number}?\n")
                correct_answer = math.floor(int(current_sub_number)/self.divisor)

                while number_of_times != str(correct_answer):
                    self.current_tries += 1
                    if self.current_tries > 3:
                        print(f"Hint: {correct_answer}")
                    number_of_times = input(f"Not quite right, try again! How many times can {self.divisor} for into {current_sub_number}?\n")

                self.quotient += number_of_times
                self.current_tries = 0

                print("\n")
                print(f"Great job! {self.divisor} will go {number_of_times} times into {current_sub_number}. Our problem now looks like this:\n")

                self.top_offset = (len(f"{self.divisor})") + len(self.all_sub_numbers[0])-1)*" "
                self.equals_line = len(f"{self.dividend})")*"="
                self.get_equation_state()
                print(self.equation_state)

                game_state = "Multiplication"

            if game_state == "Multiplication":

                product_to_compute = input(f"Multiplication phase! We now multiply our divisor ({self.divisor}) by the amount of times ({number_of_times}) that we determined it can go into our current sub number of the dividend ({current_sub_number}). What is {number_of_times} x {self.divisor}?\n")
                correct_answer = int(number_of_times) * self.divisor

                while product_to_compute != str(correct_answer):
                    self.current_tries += 1
                    if self.current_tries > 3:
                        print(f"Hint: {correct_answer}")
                    product_to_compute = input(f"Whoops, that not quite it. Try again! What is {number_of_times} x {self.divisor}?\n")
                self.current_tries = 0
                self.all_computed_products.append(product_to_compute)
                self.game_state = "Subtraction"

            if self.game_state == "Subtraction":
                print("\n")
                print(f"Well done! Our next step is to subtract this answer from our current sub number of our dividend ({current_sub_number}). That now makes our equation look like this:\n")
                self.get_equation_state()
                print(self.equation_state)

                difference_to_compute = input(f"What is {current_sub_number} - {product_to_compute}?\n")
                correct_answer = int(current_sub_number) - int(product_to_compute)

                while difference_to_compute != str(correct_answer):
                    self.current_tries += 1
                    if self.current_tries > 3:
                        print(f"Hint: {correct_answer}")
                    difference_to_compute = input(f"Almost! Try again. What is {current_sub_number} - {product_to_compute}?\n")
                self.current_tries = 0
                self.answer_found = self.index_to_bring_down == len(self.dividend_string)

                if not self.answer_found:
                    self.game_state = "Remainder"

            if self.game_state == "Remainder":
                print("\n")
                print("Awesome work! Now we bring down our next number in placevalue from our original dividend like so:\n")
                remainder = str(correct_answer) + self.dividend_string[self.index_to_bring_down]

                self.all_sub_numbers.append(remainder)
                self.index_to_bring_down += 1
                self.get_equation_state()

                print(self.equation_state)

                self.game_state = "Short Division"

            elif self.answer_found:
                self.game_state = "Game Over"
                self.final_remainder = correct_answer
                self.get_equation_state()
                print(f"\nYOU DID IT! We now know that since our remaining value of {self.final_remainder} is less than our divisor, we have fully solved the equation.\n")
                print(f"Our answer is: {self.dividend}/{self.divisor} = {self.quotient} with a remainder of {self.final_remainder}.\n")
                print(self.equation_state)

if __name__ == "__main__":
    game = LongDivision()
    game.play_game()