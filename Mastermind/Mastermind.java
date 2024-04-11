import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import javax.swing.JOptionPane;
import java.lang.reflect.Type;

public class Mastermind {
    private int numRows = 10;
    private int numCols = 3;
    private int rounds = 0;

    Gson gson = new Gson();
    String [][] board = new String[numRows][numCols];

    String [] answerString = new String[numCols];
    String [] colors = {"Red", "Blue", "Green", "Yellow"};
    String [] choices = new String[numCols];

    int [] numCorrect = new int[numRows];
    int [] numAlmost = new int[numRows];

    Result newResult;

    public static void main(String args[]) {
        while (true) {
            int choice = JOptionPane.showOptionDialog(null, "Choose a difficulty", "Difficulty", JOptionPane.DEFAULT_OPTION, JOptionPane.QUESTION_MESSAGE, null, new String[] {"Random", "Hard", "Medium", "Easy"}, "Easy");
            Mastermind game = new Mastermind(4-choice);
        }
    }

    public Mastermind(int difficulty){
        ArrayList<Result> initialResults = getResults("data/result.json");
        Collections.shuffle(initialResults);

        for (int x = 0; x < numRows; x++) {
            for (int y = 0; y < numCols; y++) {
                board[x][y] = "X";
            }
        }

        if (difficulty == 4) {
            for (int x = 0; x < numCols; x++) {
                int color = (int)(Math.random() * colors.length);
                answerString[x] = colors[color];
                System.out.println(colors[color]);
            }
        }
        else  {
            for (Result result: initialResults) {
                if (result.getRounds() < (difficulty * 3)) {
                    for (int y = 0; y < numCols; y++) {
                        answerString[y] = result.getAnswer()[y];
                        System.out.println(answerString[y]);
                    }
                    break;
                }
            }
        }


        while (getWon() == false && getLost() == false) {
            JOptionPane.showMessageDialog(null, getBoard());

            int correct = 0;
            int almost = 0;

            for (int x = 0; x < numCols; x++) {
                int choice = JOptionPane.showOptionDialog(null, "Choose a color for spot " + (x+1), "Color for spot " + (x+1), JOptionPane.DEFAULT_OPTION, JOptionPane.QUESTION_MESSAGE, null, colors, colors[0]);
                choices[x] = colors[choice];

                if (checkCorrect(x)) {
                    correct++;
                }
                else if (checkAlmost(choices[x], x)) {
                    almost++;
                }
            }
            numCorrect[rounds] = correct;
            numAlmost[rounds] = almost;
            JOptionPane.showMessageDialog(null, "You have " + correct + " in the correct spot and " + almost + " the right color but wrong spot");
            rounds++;
            board = updateBoard(choices, board);
        }
            ArrayList<Result> results = getResults("data/result.json");
            if (results != null) {
                results.add(newResult);
            } else {
                System.out.println("Failed to load results from file.");
            }

            storeResult(results);
    }

    public String[][] updateBoard(String[] choices, String[][] board) {
        for (int x = 0; x < numCols; x++) {
            board[10-rounds][x] = choices[x].substring(0, 1);
        }
        return board;
    }

    public String getBoard() {
        String screen = "";
        screen += "Colors" + "\t" + "Right" + "\t" + "Almost" + "\n";
        for (int x = 0; x < numRows; x++) {
            for (int y = 0; y < numCols; y++) {
                screen += board[x][y] + "\t";
            }
            screen += "\t\t\t\t\t" + numCorrect[9-x] + "\t\t\t\t\t" + numAlmost[9-x] + "\n";
        }
        return screen;
    }

    public boolean getWon() {
        for (int x = 0; x < numCols; x++) {
            if (choices[x] != answerString[x]) {
                return false;
            }
        }
        JOptionPane.showMessageDialog(null, "You Won! It took you " + rounds + " rounds to win!");
        newResult = new Result(answerString, rounds, true);
        return true;
    }

    public boolean getLost() {
        if (rounds == numRows-1) {
            JOptionPane.showMessageDialog(null, "Game over! The correct answer was: " + answerString[0] + " " + answerString[1] + " " + answerString[2] + " " + answerString[3]);
            newResult = new Result(answerString, rounds, false);
            return true;

        }
        else {
            return false;
        }
    }

    public boolean checkCorrect(int index) {
        return (choices[index] == answerString[index]);
    }
    public boolean checkAlmost(String choice, int index) {
        for (int x = 0; x < numCols; x++) {
            if (choice == answerString[x] && x != index) {
                return true;
            }
        }
        return false;
    }

    public void storeResult(Object obj) {
        try (FileWriter writer = new FileWriter("data/result.json")) {
            gson.toJson(obj, writer);
            System.out.println("Result object saved successfully.");
        } catch (IOException e) {
            e.printStackTrace();
        }
        // :) Kaitlyn was here
    }

    public Result getResult(String route) {
        try {
            Gson gson = new Gson();
            java.nio.file.Path path = Paths.get(route);
            String json = Files.readString(path);
            Result result = gson.fromJson(json, Result.class);
            System.out.println("Result object loaded successfully.");
            return result;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public ArrayList<Result> getResults(String route) {
        try {
            Gson gson = new Gson();
            java.nio.file.Path path = Paths.get(route);
            String json = Files.readString(path);
            Type listType = new TypeToken<ArrayList<Result>>(){}.getType();
            ArrayList<Result> results = gson.fromJson(json, listType);
            System.out.println("Result object loaded successfully.");
            return results;
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}