FROM uppoints/docker-java-gcc
EXPOSE 8080
ADD ./target/webide-0.0.1-SNAPSHOT.jar webide.jar
ENTRYPOINT ["java","-jar","/webide.jar"]
