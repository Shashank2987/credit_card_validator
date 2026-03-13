#include <iostream>
#include <string>
#include <vector>
using namespace std;
struct crule{
    string name;
    vector <string> prefixes;
};
struct binrule{
    string bin;
    string issuer;
};
void bininfo(string cnm){
    vector<binrule> database{
    {"484718","Yes Bank"},
    {"478286","IndusInd Bank"},
    {"483345","IDFC First Bank"},
    {"421336","Union Bank of India"},
    {"437748","Canara Bank"},
    {"438628","Indian Bank"},
    {"440393","Central Bank of India"},
    {"441139","Bank of India"},
    {"446293","UCO Bank"},
    {"451185","South Indian Bank"},
    {"459761","Federal Bank"},
    {"468540","RBL Bank"},
    {"470589","Bandhan Bank"},
    {"471604","American Express Bank"},
    {"475128","US Bank"},
    {"476173","PNC Bank"},
    {"479197","SunTrust Bank"},
    {"483316","Santander"},
    {"489514","BBVA"},
    {"492181","Deutsche Bank"},
    {"498824","Credit Suisse"},
    {"400551","Bank of America"},
    {"414720","Wells Fargo"},
    {"453201","JPMorgan Chase"},
    {"455673","BNP Paribas"},
    {"448407","ING Bank"},
    {"457173","DBS Bank"},
    {"456735","UOB Bank"},
    {"432215","OCBC Bank"},
    {"421275","Emirates NBD"},
    {"470132","Qatar National Bank"},
    {"476134","Standard Chartered"},
    {"481588","NatWest"},
    {"482269","Lloyds Bank"},
    {"485464","HSBC UK"},
    {"491730","Rabobank"},
    {"492905","Nordea Bank"},
    {"493728","Danske Bank"},
    {"494053","Swedbank"},
    {"497010","ABN AMRO"},
    {"498765","Mitsubishi UFJ Financial Group"},
    {"499273","Sumitomo Mitsui Banking Corporation"},
    {"499816","Bank of Tokyo"}
    };
    for(const auto &entry : database){
        if(cnm.substr(0,6) == entry.bin){
            cout<<"Bank Name: "<<entry.issuer<<endl;
            return;
        }
    }
    cout<<"Bank Name: "<<"Unknown"<<endl;
}
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
                return;
            }
        }
    }
    cout<<"Card Type: "<<"Unknown"<<endl;
}
bool luhncheck(string cnm){
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
}
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
            bininfo(cardnumber);
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