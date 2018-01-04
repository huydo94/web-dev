import sys,os,re

if len(sys.argv) < 2:
    sys.exit("Usage: %s filename" % sys.argv[0])

filename = sys.argv[1]

if not os.path.exists(filename):
    sys.exit("Error: File '%s' not found" % filename)
# define player class
class Player:
	def __init__(self,name):
		self.name = name
		self.atbats = 0
		self.hits = 0
		self.battingavg = 0
	def update(self,newatbats,newhits):
		self.atbats += newatbats
		self.hits += newhits

playertable = {}

with open(filename) as f:
    for line in f:
    	#regex to parse lines
    	matchObj = re.match( r'(.*) batted (\d*) times with (\d*) hits and (\d*) runs', line)
    	if matchObj:
    		name = matchObj.group(1)
    		bats = int(matchObj.group(2))
    		hits = int(matchObj.group(3))
    		# update player object in table if already existed, otherwise add new player to the table
    		if name in playertable:
    			player = playertable.get(name)
    			player.update(bats,hits)
    		else:
    			playertable[name] = Player(name)
    			player = playertable.get(name)
    			player.update(bats,hits)

listplayers = []
#calculate the batting avg and make a list of player objects to sort
for name in playertable:
	player = playertable[name]
	player.battingavg = player.hits / player.atbats
	listplayers.append(player)

listplayers.sort(key=lambda x: x.battingavg,reverse=True)

#print the results
for player in listplayers:
	print("%s: %.3f" %(player.name,player.battingavg))
