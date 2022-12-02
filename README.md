# Summary

A snake game developed in JavaScript, HTML and CSS. Can be played at https://htmlpreview.github.io/?https://github.com/navsam9/SnakeGame/blob/master/snakeGame/snakeGame.html.

# Rules

Eating an apple increments the snake length. Eating a rotten apple decrements the snake length.
Eating a potion increases snake length by 3. Eating poison ends the game.
Any time an item is eaten, new items appear with a given probability.
Apple appears with probability 1, rotten apple with probability 1/3,
poison with probability 1/5 and potion with probability 1/7.

You lose if you run into yourself, eat poison or snake length is 0 (by eating too many rotten apples).

# Reference

This project was inspired by https://www.freecodecamp.org/news/how-to-build-a-snake-game-in-javascript/.
