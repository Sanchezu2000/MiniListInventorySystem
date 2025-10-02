public class MiniItem
{
    public int Id { get; set; }
    public string ItemName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Quantity { get; set; } // Must be int
    public string Unit { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime? DateAdded { get; set; } // Optional date
}
