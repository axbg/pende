package com.webide.webide;

public class InputGDB {

  private final long id;
  private final String content;

  public InputGDB(long id, String content) {
    this.id = id;
    this.content = content;
  }

  public long getId() {
    return id;
  }

  public String getContent() {
    return content;
  }

}
