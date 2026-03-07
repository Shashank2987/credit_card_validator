#include <iostream>
#include <string>
using namespace std;
bool luhncheck(string cnm){{
    int sum=0;
    bool dbldigit = false;
    for(int i = cnm.length() - 1;i>=0;i--){
        int digit = cnm[i] - '0';
        if(dbldigit){
            digit *= 2;
            if(digit > 9){
                digit -= 9;
            }
        }
        sum += digit;
        dbldigit  = !dbldigit;
    }
    return sum %10 == 0;
}}
bool numcheck(string cnm){
    for(char c: cnm){
        if(!isdigit(c)){
            return false;
            break;
        }

    }
    return true;
}
int main()
{
    string cardnumber;
    cout<<"-----Credit Card Validator-----"<<endl;
    cout<<"Enter Your Credit Card Number: ";
    cin>>cardnumber;
    if(numcheck(cardnumber)){
        if(luhncheck(cardnumber)){
            cout<<"VALID CREDIT CARD"<<endl;
        }
        else{
            cout<<"INVALID CREDIT CARD"<<endl;
    }
    }
    else{
        cout<<"ERROR: Card Number must contain only Digits"<<endl;
    }
    return 0;
}