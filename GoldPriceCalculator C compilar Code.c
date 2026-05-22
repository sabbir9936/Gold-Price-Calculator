#include <stdio.h>
int main()
{
    double price_per_vori;
    double vori,ana,roti,point;

    printf("--- Gold Price Calculator ---\n\n");

    printf("Proti Vori Gold Price (BDT/Price): ");
    scanf("%lf", &price_per_vori);

    printf("\n--- Jewellery Weight Input ---\n");
    printf("\n");
    printf("Vori: ");
    scanf("%lf",&vori);
    printf("Ana: ");
    scanf("%lf",&ana);
    printf("Roti: ");
    scanf("%lf",&roti);
    printf("Point: ");
    scanf("%lf",&point);

    double total_points_in_one_vori=16.0*6.0*10.0;

    double user_total_points = (vori*16.0*6.0*10.0) +
                               (ana*6.0*10.0) +
                               (roti*10.0) +
                               point;

    double total_price=(user_total_points/total_points_in_one_vori)*price_per_vori;

    printf("\n-----------------------------------------\n");
    printf("\n");
    printf("Total Weight : %.0f Vori, %.0f Ana, %.0f Roti, %.0f Point\n",vori,ana,roti,point);
    printf("\n");
    printf("Jewellery Total Price : %.2f Taka\n", total_price);
    printf("\n");
    printf("-------------------------------------------\n");

    return 0;
}
