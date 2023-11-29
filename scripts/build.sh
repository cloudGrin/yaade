# move to root folder
cd ..

# build client
cd client/
npm run build
cd ..

# move client build into server
rm -rf server/src/main/resources/webroot
mv client/dist server/src/main/resources/webroot

# build server
cd server

# build the docker container
docker buildx build --platform linux/amd64 -f Dockerfile -t cloudgrin/yaade:latest . --push

