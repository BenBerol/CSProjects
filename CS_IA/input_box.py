import tkinter as tk
from tkinter import font


class InputBox():
    """
    A class representing an input box in a tkinter GUI.

    Parameters:
    - tab (tk.Frame): The parent frame where the input box will be placed.
    - label (str): The label text for the input box.
    - numEntries (int): The number of entry boxes to create.
    - entryTexts (list): A list of initial texts for the entry boxes.
    - entry_textboxes (list): A list to store the created entry boxes.

    Methods:
    - create_input_box(text=None): Creates the input box with
    the given label text.
    - add_entry(entry_frame, index=0): Adds an entry box to the input box.
    - get_text(index=0): Returns the text in the entry box
    at the given index.
    - set_text(text: str, index=0): Sets the text in the entry box
    at the given index.
    - clear_text(index=0): Clears the text in the entry box at the given index.
    - set_font(font: tk.font.Font, index=0): Sets the font for
    the entry box at the given index.
    """

    def __init__(
            self, tab: tk.Frame, label: str = None,
            numEntries: int = 1, entryTexts: list = None):
        self.tab = tab
        self.label = label
        self.numEntries = numEntries
        self.entryTexts = entryTexts if entryTexts is not None else []
        self.entry_textboxes = []

        self.body_font = tk.font.Font(family="Arial", size=12)

        self.create_input_box(self.label)

    def create_input_box(self, text=None):
        # Creates the input box with the given label text.
        entry_frame = tk.Frame(self.tab)
        entry_frame.pack()

        entry_label = tk.Label(entry_frame, text=text)
        entry_label.pack(side=tk.LEFT)

        for i in range(self.numEntries):
            self.add_entry(entry_frame, i)

    def add_entry(self, entry_frame, index=0):
        # Adds an entry box to the input box.
        entry_textbox = tk.Entry(entry_frame, font=self.body_font)
        entry_textbox.pack(side=tk.LEFT)

        if self.entryTexts is not None and index < len(self.entryTexts):
            entry_textbox.insert(0, self.entryTexts[index])

        self.entry_textboxes.append(entry_textbox)

    def get_text(self, index=0):
        # Returns the text in the entry box at the given index.
        return self.entry_textboxes[index].get()

    def set_text(self, text: str, index=0):
        # Sets the text in the entry box at the given index.
        self.entry_textboxes[index].delete(0, tk.END)
        self.entry_textboxes[index].insert(0, text)

    def clear_text(self, index=0):
        # Clears the text in the entry box at the given index.
        self.entry_textboxes[index].delete(0, tk.END)

    def set_font(self, font: tk.font.Font, index=0):
        # Sets the font for the entry box at the given index.
        self.entry_textboxes[index].config(font=font)
