# 第一次构建
FROM openjdk:11 as first

WORKDIR /app

# 安装Kotlin环境并构建jar包
RUN apt-get update && \
    apt-get install -y curl zip unzip && \
    curl -s "https://get.sdkman.io" | bash && \
    bash -c "source /root/.sdkman/bin/sdkman-init.sh && sdk install kotlin" && \
    rm -rf /var/lib/apt/lists/*

# 拷贝项目文件并构建jar包
COPY . .
RUN ./gradlew clean assemble

# 第二次构建
FROM amazoncorretto:11

RUN mkdir /app

# 从第一次构建的镜像中拷贝jar包
COPY --from=first /app/build/libs/yaade-server-1.0-SNAPSHOT.jar /app/yaade.jar

EXPOSE 9339

CMD ["java", "-jar", "/app/yaade.jar"]