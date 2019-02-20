package com.webide.webide;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintStream;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class InputController {


  private static final String template = "Hello, %s!";
  private final AtomicLong counter = new AtomicLong();

  @PostMapping("/input_gdb")
  @ResponseBody
  public InputGDB sayHello(@RequestBody String code) throws IOException {
    String result = "";

    createCodeFile(code);

    result += executeCommand("gcc -Wall -o program program.c");
    result = result + executeCommand("./program");

    return new InputGDB(counter.incrementAndGet(), String.format(template, result));
  }

  private void createCodeFile(@RequestBody String code) {
    try (PrintStream out = new PrintStream(new FileOutputStream("program.c"))) {
      out.print(code);
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    }
  }

  private String executeCommand(String command) throws IOException {
    ProcessBuilder ps;
    Process pr;
    BufferedReader in;
    String line;
    StringBuilder result = new StringBuilder();
    String[] commands = command.split(" ");
    ps = new ProcessBuilder(commands);

    ps.redirectErrorStream(true);
    pr = ps.start();

    in = new BufferedReader(new InputStreamReader(pr.getInputStream()));

    while ((line = in.readLine()) != null) {
      System.out.println(line);
      result.append(line);
    }
    try {
      pr.waitFor();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }

    in.close();
    return result.toString();
  }
}
