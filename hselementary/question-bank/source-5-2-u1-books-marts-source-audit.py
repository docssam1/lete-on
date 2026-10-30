"""Check printed p.9 books and one-store cost comparison."""
story=436
science=story//4
biographies=story//2
total=story+science+biographies
assert (science,biographies,total)==(109,218,763)
assert (total+49)//50==16 and 15*50<total<=16*50
students=652
cost_a=((students+14)//15)*9000
cost_b=((students+23)//24)*13000
assert (cost_a,cost_b,cost_a-cost_b)==(396000,364000,32000)
print('Books: 763, 16 boxes; one-store comparison: B 364000, saves 32000.')
