#include<stdio.h>

    int main() {
      setbuf(stdout, NULL);
          
      int x, y;
          
      printf("Enter x : ");
          
      scanf("%d", &x);
          
      printf("Enter y : ");
    
          
      scanf("%d", &y);
          
      printf("Value entered y is %d\n", y);
      printf("Value entered x is %d\n", x);
          
      return 0;
    }