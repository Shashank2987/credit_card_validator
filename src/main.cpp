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
void cardtype(string cnm){
    if(cnm[0] == '4'){
        cout<<"Card Type: Visa"<<endl;
    }
    else if(cnm.substr(0,2) == "34" || cnm.substr(0,2) == "37"){
        cout<<"Card Type: American Express"<<endl;
    }
    else if(cnm.substr(0,2) >= "51" && cnm.substr(0,2) <= "55"){
        cout<<"Card Type: Mastercard"<<endl;
    }
    else{
        cout<<"Card Type: Unkown"<<endl;
    }

}
void mask(string cnm){
    for(int i=0;i<cnm.length()-4;i++){
        cout<<"*";
    }
    for(int i=cnm.length()-4;i<cnm.length();i++){
        cout<<cnm[i];
    }
}
int main()
{
    string cardnumber;
    cout<<"-----Credit Card Validator-----"<<endl;
    cout<<"Enter Your Credit Card Number: ";
    cin>>cardnumber;
    cout<<"\n===================\n";
    cout<<"Card Number : ";
    mask(cardnumber);
    cout<<endl;
    if(numcheck(cardnumber)){
        if(luhncheck(cardnumber)){
            cout<<"Validation Result: VALID"<<endl;
            cardtype(cardnumber);
        }
        else{
            cout<<"Validation Result: INVALID"<<endl;
    }
    }
    else{
        cout<<"ERROR: Card Number must contain only Digits"<<endl;
    }
     cout<<"===================\n";
    return 0;
}