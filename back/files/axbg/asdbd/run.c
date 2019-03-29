#include<stdio.h>

int main() {
setbuf(stdout, NULL);

int x, y;

printf("Enter x : ");
//fflush(stdout);

scanf("%d", &x);

printf("Enter y : ");
//fflush(stdout);

scanf("%d", &y);

printf("Value entered y is %d\n", y);
printf("Value entered x is %d\n", x);

for(int i=0; i<10;i++){
    printf("%d", i);
}
return 0;
}