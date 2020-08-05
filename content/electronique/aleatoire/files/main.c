#include "config.h"

/*
 * PORTB : leds a->g (1:on, 0:off)
 * PORTA2-3-4 : display 3->1 (1:blank, 0:sel)
 * A0-1 : button (need pull-up)
 * A7 : input
 */

//Timer
#define TMR0_REFRESH 0x38 //800uS @ 4MHz (/4 prescaler)
#define TMR1_REFRESH 0x0000 //500mS @ 4MHz (/8 prescaler) (with compensation (+25ms))
//Buttons
#define BTN_NEW  0
#define BTN_MODE 1
//Random
#define RND_PIN 7
#define DELAY_RND 100
//Displays
#define DISPLAYS 3
#define SEGMENTS 7
#define DIS_MASK (0b00011100)
#define DIS_POS  2
#define CHR_BLK  36
#define CHR_TRH  37
#define _A(a) (((a)-'a')+10)
#define _0(a) ((a)-'0')
/*MSB=SEGH, LSB=SEGA*/
const byte charset[]={0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F, //0-9
                      0x77, 0x7C, 0x39, 0x5E, 0x79, 0x71, 0x3D, 0x74, 0x04, 0x0E, 0x75, 0x30, 0x37, 0x54, 0x5C, 0x73, 0x67, 0x50, 0x6D, 0x78, 0x1C, 0x2A, 0x6A, 0x36, 0x66, 0x5B,// a-z
                      0x00, 0x49}; // ' ', 'throw'
//Mode
#define MODE_NUM 10
typedef enum{
    D2, D3, D4, D6, D10, D12, D20, D100, DEXA,
    CHRONO
} MODE_t;

//Global values
byte displayValues[DISPLAYS] = {2, 1, 7};
byte secs = 40;
byte mins = 23;

//Prototypes
void init();
void updateDisplays();
void blink();
word getRandom(word numBits);
word getIntervalRandom(word min, word max);
void print(const char* str);

void main(void) {
    
    word min = 0x00;
    word max = 0xFE;
    word rnd;
    
    MODE_t mode = D2;
    
    init();
    INTCONbits.T0IF = 1; //Launch
    INTCONbits.T0IE = 1; //display
    
    print("u10");
    __delay_ms(200);
    print("tel");
    __delay_ms(250);
    print("ec ");
    __delay_ms(250);
    
    while(1){
        if(mode < CHRONO){ //Dice mode
            if(_GET(PORTA, BTN_NEW) != 0){ //IDLE
                displayValues[0] = max%10;
                displayValues[1] = max/10;
                displayValues[2] = _A('d');
            }
            else{ //New rand
                rnd = getIntervalRandom(min, max);
                switch(mode)
                {
                    case D2:
                    case D3:
                        switch(rnd){
                            case 0:
                                print("oui"); break;
                            case 1:
                                print("non"); break;
                            case 2:
                                print("lol"); break;
                        }  
                    break;

                    case D4:
                    case D6:
                    case D10:
                    case D12:
                    case D20:
                    case D100:
                        displayValues[0] = rnd%10;
                        displayValues[1] = rnd/10;
                        displayValues[2] = CHR_TRH;
                    break;

                    case DEXA:
                        displayValues[0] = rnd%16;
                        displayValues[1] = rnd/16;
                        displayValues[2] = CHR_TRH;
                    break;
                }

                __delay_ms(500);
            }
        }
        else{ //CHRONO mode (mms)
            if(_GET(PORTA, BTN_NEW) == 0){secs=0; mins=0;}
            displayValues[0] = secs/10;
            displayValues[1] = mins%10;
            displayValues[2] = mins/10;
        }
        
        //Change mode
        if(_GET(PORTA, BTN_MODE) == 0)
        {
            mode = (mode+1)%MODE_NUM;
            __delay_ms(10);
            while(_GET(PORTA, BTN_MODE) == 0);
            __delay_ms(10);
            
            //Set min/max values
            switch(mode)
            {
                case D2:
                    min = 0; max = 1;
                break;
                case D3:
                    min = 0; max = 2;
                break;
                case D4:
                    min = 1; max = 4;
                break;
                case D6:
                    min = 1; max = 6;
                break;
                case D10:
                    min = 1; max = 10;
                break;
                case D12:
                    min = 1; max = 12;
                break;
                case D20:
                    min = 1; max = 20;
                break;
                case D100:
                    min = 1; max = 100;
                break;
                case DEXA:
                    min = 0; max = 0xFF;
                break;
                
                default:
                    min = 0; max = 0;
                break;
            }
        }
        
        
    }
    
    return;
}

void init(){
    TRISA = 0xFF;
    TRISB = 0xFF;
    __delay_ms(1000);
    
    //IO
    PORTA = 0x00;
    PORTB = 0x00;
    TRISA = 0b11100011;
    TRISB = 0x00;
    CMCON = 0x07;
    
    //Timer
    OPTION_REG = 0x09; //TMR0 /4 prescaler
    T1CON = 0b00110101; //TMR1 /8prescaler
    //Interrupts
    INTCONbits.T0IF = 0;
    PIR1bits.TMR1IF = 0;
    INTCONbits.T0IE = 0;
    PIE1bits.TMR1IE = 1;
    INTCONbits.GIE = 1;
    
    //blink();
}

void blink(){
    int i;
    
    PORTA = 0x00;
    for(i=0;i<2; i++){
        PORTB = 0x01;
        __delay_ms(500);
        PORTB = 0x00;
        __delay_ms(500);
    }
}

//Print DISPLAYS chars on display
void print(const char* str){
    byte i;
    char chr;
    
    for(i=0; i<DISPLAYS; i++){
        chr = *(str+i);
        if(('0'<=chr) && (chr<='9'))
            displayValues[DISPLAYS-i-1] = _0(chr);
        else if(('a'<=chr) && (chr<='z'))
            displayValues[DISPLAYS-i-1] = _A(chr);
        else
            displayValues[DISPLAYS-i-1] = CHR_BLK;
    }
}

/*
#define CHR_DOT  37
#define CHR_DEGREE  38
#define CHR_UNDER  39
void writeo(const char* a, sbyte start)
{
    byte i,j;
    char chr;
    
    if(start<0){
        start =  -start - getPrintableSize(a) -1;
    }
    start = _MIN(_MAX(start, 0), DISPLAYS-1); //Clipping
    
    for(i=start, j=0; (i<DISPLAYS) && (a[j] != '\0'); i++, j++){
        chr = a[j];
        if(('0'<=chr) && (chr<='9')) //0-9
            display[i] = _0(chr);
        else if(('a'<=chr) && (chr<='z')) //a-z
            display[i] = _A(chr);
        //Specials characters
        else if(chr == '.')
            display[--i] |= charset[CHR_DOT]; //Put it on the last char
        else if(chr == '*')
            display[i] = charset[CHR_DEGREE];
        else if(chr == '_')
            display[i] = charset[CHR_UNDER];
        else //All others chars
            display[i] = charset[CHR_BLK];
    }
}
 */
//Put next segment on display
void updateDisplays(){
    static uint8_t display=0;
    static uint8_t segment=0;
    
    segment++;
    if(segment >= SEGMENTS){
        segment = 0;
        display = (display + 1)%DISPLAYS;
        
        PORTB = 0x00;
        PORTA = (PORTA & ~DIS_MASK) | ((~(1<<(display+DIS_POS))) & DIS_MASK);
    }
    PORTB = charset[displayValues[display]] & (1<<segment);
}

/*
 * Random function
 * They create the less biased random number
 */
word getRandom(word numBits){
    word i, rnd=0;
    
    for(i=0; i<numBits; i++){
        rnd = (rnd<<1) | _GET(PORTA, RND_PIN);
        __delay_us(DELAY_RND);
    }
    
    return rnd;
}
word getIntervalRandom(word min, word max){
    word numBits = 0;
    word temp = max-min+1;
    
    while(temp != 0){
        temp >>= 1;
        numBits++;
    }
    if(numBits == 0) return 0;
    
    do{
        temp=getRandom(numBits);
    }while(temp>(max-min));
    
    return temp+min;
}

/*
 * Interrupts function
 * handle timers for display refresh and time measuring mode
 */
void interrupt it_main(){
    static byte tick=0;
    
    if(INTCONbits.T0IF == 1){
        updateDisplays();
        TMR0 = TMR0_REFRESH;
        INTCONbits.T0IF = 0;
    }
    
    if(PIR1bits.TMR1IF == 1){
        T1CONbits.TMR1ON = 0;
        tick++;
        if(tick == 2){
            tick = 0;
            secs++;
            if(secs>=60){
                secs=0;
                mins++;
                if(mins>=99){
                    mins=0;
                }
            }
        }
        TMR1H = (byte) (TMR1_REFRESH >> 8);
        TMR1L = (byte) (TMR1_REFRESH);
        T1CONbits.TMR1ON = 1;
        PIR1bits.TMR1IF = 0;
    }
}