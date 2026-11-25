int addBonus(int total, int bonus)
{
    total += bonus;
    return total;
}

int main()
{
    int score = 5;
    score = addBonus(score, 2);
    score = addBonus(score, 3);
    println("Total: " + score);
    return 0;
}
