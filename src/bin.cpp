#include <iostream>
#include <vector>
#include <string>
using namespace std;
struct binrule{
    string bin;
    string issuer;
};
void bininfo(string cnm){
    vector<binrule> database{
    {"453201","JPMorgan Chase"},
    {"453978","State Bank of India"},
    {"431940","HDFC Bank"},
    {"524193","ICICI Bank"},
    {"531004","Axis Bank"},
    {"508159","Punjab National Bank"},
    {"652150","Bank of Baroda"},
    {"607153","Kotak Mahindra Bank"},

    {"542418","HSBC"},
    {"400551","Bank of America"},
    {"414720","Wells Fargo"},
    {"520000","Citibank"},
    {"540400","Barclays"},
    {"356819","SBI Card"},
    {"601111","Discover Financial"},
    {"622126","UnionPay"},
    {"353011","JCB"},
    {"305693","Diners Club"}
    };
    for(const auto &entry : database){
        if(cnm.substr(0,6) == entry.bin){
            cout<<"Bank Name: "<<entry.issuer<<endl;
        }
    }
}
int main()
{
    return 0;
}