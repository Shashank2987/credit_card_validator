#include <iostream>
#include <string>
#include <vector>
using namespace std;

struct crule {
    string name;
    vector<string> prefixes;
};

void cardtype(const string &cnm) {
    vector<crule> rule;
rule.push_back({"Visa", {"4"}});
rule.push_back({"Mastercard", {"51","52","53","54","55"}});
rule.push_back({"American Express", {"34","37"}});
rule.push_back({"Discover", {"6011","65"}});
rule.push_back({"JCB", {"35"}});
rule.push_back({"Diners Club", {"300","301","302","303","304","305","36","38"}});
rule.push_back({"RuPay", {"60","65","81","82"}});
rule.push_back({"UnionPay", {"62"}});
rule.push_back({"Maestro", {"50","56","57","58","63","67"}});

    for (const auto &rl : rule) {
        for (const auto &s1 : rl.prefixes) {
            if (cnm.substr(0, s1.length()) == s1) {
                cout << "Card Type: " << rl.name << endl;
                return;
            }
        }
    }

    cout << "Unknown Card Type" << endl;
}

int main() {
    string card;
    cout << "Enter card number: ";
    cin >> card;

    cardtype(card);

    return 0;
}