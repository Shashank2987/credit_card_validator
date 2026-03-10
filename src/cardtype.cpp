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
        {"American Express",{"34","37"}}
    };
    for(const auto &rl : rule){
        for(const string &s1 : rl.prefixes){
            if(cnm.substr(0,s1.length()) == s1){
                cout<<"Card Type : "<<rl.name<<endl;
            }
        }
    }

}
int main(){

}