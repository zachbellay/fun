#! /bin/zsh

alias blender='/Applications/Blender.app/Contents/MacOS/Blender'

python3 texture.py $1

blender --background --python cube.py -- $1