import tkinter as tk
import input_box as ib
from tkinter import ttk
from tkinter import font


class GUI:

    """
    A class representing the main GUI application using tkinter.

    Methods:
    - __init__(): Initializes the GUI application, creates the main window,
    and sets up the tabs.
    - button_clicked(): A function that is called when the user clicks
    the button.
    """

    def __init__(self):
        # Makes the tkinter outline
        self.root = tk.Tk()
        self.root.title("My App")
        self.root.geometry("500x500")

        # Create a Notebook widget
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(expand=1, fill='both')

        # Create frames for each tab
        self.tab1 = tk.Frame(self.notebook)
        self.tab2 = tk.Frame(self.notebook)
        self.tab3 = tk.Frame(self.notebook)

        # Add tabs to the notebook
        self.notebook.add(self.tab1, text='Tab 1')
        self.notebook.add(self.tab2, text='Tab 2')
        self.notebook.add(self.tab3, text='Tab 3')

        # Create fonts
        title_font = font.Font(
            family="Arial", size=25, weight="bold", underline=1
        )
        body_font = font.Font(family="Arial", size=12)

        tk.Label(
            self.tab1, text="Welcome Enter Info Here:", font=title_font
        ).pack(pady=20)

        # Create a textbox
        self.teamNumber = ib.InputBox(
            self.tab1, "Enter your team number: "
        )

        self.button = tk.Button(
            self.tab1, text="Click me", command=self.button_clicked
        ).pack(pady=20)

        tk.Label(self.tab2, text="This is Tab 2").pack(pady=20)

        self.root.mainloop()
        print("GUI initialized")

    # This function is called when the user clicks the button
    def button_clicked(self):
        print("Button clicked")
