import java.util.ArrayList;

public class Quiz {

    private ArrayList<Question> questions;

    public Quiz() {

        questions = new ArrayList<>();

        questions.add(
            new Question(
                "Who developed Java?",
                new String[]{
                    "Microsoft",
                    "Sun Microsystems",
                    "Google",
                    "IBM"
                },
                1
            )
        );
    }

    public ArrayList<Question> getQuestions() {
        return questions;
    }
}