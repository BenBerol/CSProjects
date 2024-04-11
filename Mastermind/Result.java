public class Result {
    private String[] answerString;
    private int rounds;
    private boolean won;

    public Result(String[] answerString, int rounds, boolean won) {
        this.answerString = answerString;
        this.rounds = rounds;
        this.won = won;
    }

    public String[] getAnswer() {
        return answerString;
    }
    public int getRounds() {
        return rounds;
    }
    public boolean getWon() {
        return won;
    }
}
