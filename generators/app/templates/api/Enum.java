package <%=packageName%>;

public enum <%=classname%> {
    <%properties.forEach(function (property, i){%><%=property%><%if (i < properties.length - 1) {%>,<%}%>
    <%})%>
}
