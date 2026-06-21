import java.util.ArrayList;

public class Leaderboard {

    private ArrayList<User> users;

    public Leaderboard() {
        users = new ArrayList<>();
    }

    public void addUser(User user) {
        users.add(user);
    }

    public void displayLeaderboard() {

        System.out.println("Leaderboard");

        for(User user : users) {

            System.out.println(
                user.getName()
                + " - "
                + user.getScore()
            );
        }
    }
}