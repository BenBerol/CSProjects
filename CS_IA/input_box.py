import tkinter as tk
from tkinter import font


class InputBox():
    """
    A class representing an input box in a tkinter GUI.

    Parameters:
    - tab (tk.Frame): The parent frame where the input box will be placed.
    - label (str): The label text for the input box.
    - font (tk.font.Font): The font for the input box.
    - numEntries (int): The number of entry boxes to create.
    - entryTexts (list): A list of initial texts for the entry boxes.
    - entry_textboxes (list): A list to store the created entry boxes.
    - input_side (str): The side to pack the input boxes.
    - frame_side (str): The side to pack the frame.
    - visible (bool): Whether the input box is visible.


    Methods:
    - create_input_box(text=None): Creates the input box with
    the given label text.
    - add_entry(entry_frame, index=0): Adds an entry box to the input box.
    - get_text(index=0): Returns the text in the entry box
    at the given index.
    - get_all_text(): Returns a list of all the text in the entry boxes.
    - get_float(index=0): Returns the number of entry boxes.
    - get_all_float(): Returns a list of all the text in the
    entry boxes as floats.
    - set_text(text: str, index=0): Sets the text in the entry box
    at the given index.
    - clear_text(index=0): Clears the text in the entry box at the given index.
    - set_font(font: tk.font.Font, index=0): Sets the font for
    the entry box at the given index.
    - make_visible(): Makes the input box visible.
    """

    def __init__(
            self, tab: tk.Frame, label: str = None, font: font = None,
            numEntries: int = 1, entryTexts: list = None,
            frame_side=None, input_side=None, visible: bool = True):

        self.tab = tab
        self.label = label
        self.font = font if font is not None else \
            tk.font.Font(family="Arial", size=12)
        self.numEntries = numEntries
        self.entryTexts = entryTexts if entryTexts is not None else []
        self.frame_side = frame_side
        self.input_side = input_side
        self.visible = visible
        self.entry_textboxes = []

        self.create_input_box(self.label)

    def create_input_box(self, text=None):
        self.entry_frame = tk.Frame(self.tab)
        if (self.frame_side is not None):
            self.entry_frame.pack(side=self.frame_side)
        else:
            self.entry_frame.pack()

        if (self.visible is True):
            self.entry_label = tk.Label(self.entry_frame, text=text, font=self.font)
            if (self.input_side is not None):
                self.entry_label.pack(side=self.input_side)
            else:
                self.entry_label.pack()

            for i in range(self.numEntries):
                self.add_entry(self.entry_frame, i)

    def add_entry(self, entry_frame, index=0):
        entry_textbox = tk.Entry(entry_frame, font=self.font, width=10)
        if (self.input_side is not None):
            entry_textbox.pack(side=self.input_side)
        else:
            entry_textbox.pack()

        if self.entryTexts is not None and index < len(self.entryTexts):
            entry_textbox.insert(0, self.entryTexts[index])

        self.entry_textboxes.append(entry_textbox)

    def get_text(self, index=0):
        return self.entry_textboxes[index].get()

    def get_all_text(self):
        return [entry.get() for entry in self.entry_textboxes]

    def get_float(self, index=0):
        return float(self.entry_textboxes[index].get())

    def get_all_float(self):
        return [float(entry.get()) for entry in self.entry_textboxes]

    def set_text(self, text: str, index=0):
        self.entry_textboxes[index].delete(0, tk.END)
        self.entry_textboxes[index].insert(0, text)

    def clear_text(self, index=0):
        self.entry_textboxes[index].delete(0, tk.END)

    def set_font(self, font: tk.font.Font, index=0):
        self.entry_textboxes[index].config(font=font)
    
    def make_visible(self):
        self.visible = True
        self.entry_label = tk.Label(self.entry_frame, text=self.label, font=self.font)
        if (self.input_side is not None):
            self.entry_label.pack(side=self.input_side)
        else:
            self.entry_label.pack()

        for i in range(self.numEntries):
            self.add_entry(self.entry_frame, i)

    def make_invisible(self):
        self.visible = False
        self.entry_label.pack_forget()
        for entry in self.entry_textboxes:
            entry.pack_forget()


class PointBox(InputBox):
    """
    A class representing a point input box in a tkinter GUI.

    Parameters:
    - tab (tk.Frame): The parent frame where the point box will be placed.
    - point_number (str): The label text for the point box.
    - font (tk.font.Font): The font for the point box.
    - frame_side (str): The side to pack the frame.
    - input_side (str): The side to pack the input boxes.

    Methods:
    - create_input_box(text=None): Creates the point box
    with the given label text.
    - add_entry(entry_frame, index=0): Adds an entry box to the point box.
    - get_text(index=0): Returns the text in the entry box at the given index.
    - get_all_text(): Returns a list of all the text in the entry boxes.
    - set_text(text: str, index=0): Sets the text in the entry box
    at the given index.
    - clear_text(index=0): Clears the text in the entry box at
    the given index.
    - set_font(font: tk.font.Font, index=0): Sets the font for the entry
    box at the given index.
    """

    def __init__(
            self, tab: tk.Frame, point_number, font: font = None, visible: bool = False):
        self.point_number = point_number
        super().__init__(
            tab, f"Point {point_number}", font, 3,
            ["Horizontal", "Vertical", "Angle"], tk.TOP, tk.LEFT, visible=visible)
