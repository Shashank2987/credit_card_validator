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
    string country;
};
void bininfo(string cnm){
    vector<binrule> database{
        {"484718","Yes Bank","India"},
    {"478286","IndusInd Bank","India"},
    {"483345","IDFC First Bank","India"},
    {"421336","Union Bank of India","India"},
    {"437748","Canara Bank","India"},
    {"438628","Indian Bank","India"},
    {"440393","Central Bank of India","India"},
    {"441139","Bank of India","India"},
    {"446293","UCO Bank","India"},
    {"451185","South Indian Bank","India"},
    {"459761","Federal Bank","India"},
    {"468540","RBL Bank","India"},
    {"470589","Bandhan Bank","India"},
    {"431940","HDFC Bank","India"},
    {"524193","ICICI Bank","India"},
    {"531004","Axis Bank","India"},
    {"508159","Punjab National Bank","India"},
    {"652150","Bank of Baroda","India"},
    {"607153","Kotak Mahindra Bank","India"},
    {"356819","SBI Card","India"},

    {"400551","Bank of America","USA"},
    {"414720","Wells Fargo","USA"},
    {"453201","JPMorgan Chase","USA"},
    {"520000","Citibank","USA"},
    {"542418","HSBC Bank USA","USA"},
    {"475128","US Bank","USA"},
    {"476173","PNC Bank","USA"},
    {"479197","SunTrust Bank","USA"},
    {"489514","Capital One","USA"},
    {"491730","TD Bank","USA"},
    {"492905","Charles Schwab Bank","USA"},
    {"493728","Fifth Third Bank","USA"},
    {"494053","Regions Bank","USA"},
    {"497010","BB&T Bank","USA"},
    {"498824","Ally Bank","USA"},

    {"540400","Barclays","United Kingdom"},
    {"476134","Standard Chartered","United Kingdom"},
    {"481588","NatWest","United Kingdom"},
    {"482269","Lloyds Bank","United Kingdom"},
    {"485464","HSBC UK","United Kingdom"},
    {"455673","Santander UK","United Kingdom"},
    {"432215","Royal Bank of Scotland","United Kingdom"},
    {"499273","Virgin Money UK","United Kingdom"},
    {"498765","Metro Bank","United Kingdom"},
    {"457173","TSB Bank","United Kingdom"},

    {"492181","Deutsche Bank","Germany"},
    {"448407","ING Bank","Netherlands"},
    {"491401","Rabobank","Netherlands"},
    {"493003","ABN AMRO","Netherlands"},
    {"494455","Commerzbank","Germany"},
    {"495122","UniCredit","Italy"},
    {"496882","Intesa Sanpaolo","Italy"},
    {"497444","Banco Santander","Spain"},
    {"498111","BBVA","Spain"},
    {"498999","CaixaBank","Spain"},

    {"457173","DBS Bank","Singapore"},
    {"456735","UOB Bank","Singapore"},
    {"432215","OCBC Bank","Singapore"},
    {"421275","Maybank","Malaysia"},
    {"470132","CIMB Bank","Malaysia"},
    {"476134","Bangkok Bank","Thailand"},
    {"478100","Kasikorn Bank","Thailand"},
    {"479400","Krungthai Bank","Thailand"},
    {"480600","Bank Mandiri","Indonesia"},
    {"481900","Bank Central Asia","Indonesia"},

    {"482100","Emirates NBD","UAE"},
    {"483200","Abu Dhabi Commercial Bank","UAE"},
    {"484300","First Abu Dhabi Bank","UAE"},
    {"485400","Dubai Islamic Bank","UAE"},
    {"486500","Qatar National Bank","Qatar"},
    {"487600","Doha Bank","Qatar"},
    {"488700","National Bank of Kuwait","Kuwait"},
    {"489800","Al Rajhi Bank","Saudi Arabia"},
    {"490900","Saudi National Bank","Saudi Arabia"},
    {"491000","Riyad Bank","Saudi Arabia"},

    {"492200","Bank of China","China"},
    {"493300","Industrial and Commercial Bank of China","China"},
    {"494400","China Construction Bank","China"},
    {"495500","Agricultural Bank of China","China"},
    {"496600","China Merchants Bank","China"},
    {"497700","Bank of Communications","China"},
    {"498800","Ping An Bank","China"},
    {"499900","China CITIC Bank","China"},

    {"501100","Mitsubishi UFJ Financial Group","Japan"},
    {"502200","Sumitomo Mitsui Banking Corporation","Japan"},
    {"503300","Mizuho Bank","Japan"},
    {"504400","Resona Bank","Japan"},
    {"505500","Japan Post Bank","Japan"},

    {"506600","ANZ Bank","Australia"},
    {"507700","Commonwealth Bank","Australia"},
    {"508800","Westpac Bank","Australia"},
    {"509900","National Australia Bank","Australia"},
    {"510100","Macquarie Bank","Australia"},

    {"511200","Royal Bank of Canada","Canada"},
    {"512300","Toronto-Dominion Bank","Canada"},
    {"513400","Scotiabank","Canada"},
    {"514500","Bank of Montreal","Canada"},
    {"515600","Canadian Imperial Bank of Commerce","Canada"}};
    for(const auto &entry : database){
        if(cnm.substr(0,6) == entry.bin){
            cout<<"Bank Name: "<<entry.issuer<<endl;
            cout<<"Country  : "<<entry.country<<endl;
        }
    }
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