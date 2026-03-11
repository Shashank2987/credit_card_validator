#include <iostream>
#include <string>
#include <vector>
using namespace std;
struct crule{
    string name;
    vector <string> prefixes;
};
void cardtype(string cnm){
    vector<crule>rule = 
    {
        {"Visa",{"4"}},
        {"Mastercard",{"51","52","53","54","55"}},
        {"American Express",{"34","37"}},
        {"Discover", {"6011","65"}},
        {"JCB", {"35"}},
        {"Diners Club", {"300","301","302","303","304","305","36","38"}},
        {"RuPay", {"60","65","81","82"}},
        {"UnionPay", {"62"}},
        {"Maestro", {"50","56","57","58","63","67"}}
    };
    for(const auto &rl : rule){
        for(const string &s1 : rl.prefixes){
            if(cnm.substr(0,s1.length()) == s1){
                cout<<"Card Type : "<<rl.name<<endl;
            }
        }
    }

}
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
    cout<<"\n=============================\n";
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
     cout<<"=============================\n";
    return 0;
}